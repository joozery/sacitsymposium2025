const db = require('../db/db');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../aws-config-v3');
const { v4: uuidv4 } = require('uuid');

// Helper function to safely parse JSON fields
const parseMediaFields = (item) => {
  let keywords = [];
  let additional_media_urls = [];
  
  try {
    if (item.keywords) {
      if (Array.isArray(item.keywords)) {
        keywords = item.keywords;
      } else if (typeof item.keywords === 'string') {
        if (item.keywords.startsWith('[') || item.keywords.startsWith('{')) {
          keywords = JSON.parse(item.keywords);
        } else {
          keywords = item.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        }
      } else {
        keywords = [];
      }
    }
  } catch (error) {
    console.warn('Error parsing keywords:', item.keywords, error.message);
    keywords = [];
  }
  
  try {
    if (item.additional_media_urls) {
      if (Array.isArray(item.additional_media_urls)) {
        additional_media_urls = item.additional_media_urls;
      } else if (typeof item.additional_media_urls === 'string') {
        if (item.additional_media_urls.startsWith('[') || item.additional_media_urls.startsWith('{')) {
          additional_media_urls = JSON.parse(item.additional_media_urls);
        } else {
          additional_media_urls = [];
        }
      } else {
        additional_media_urls = [];
      }
    }
  } catch (error) {
    console.warn('Error parsing additional_media_urls:', item.additional_media_urls, error.message);
    additional_media_urls = [];
  }
  
  return {
    ...item,
    keywords,
    additional_media_urls
  };
};

const MediaController = {
  // Get all media with optional filtering
  getAllMedia: async (req, res) => {
    try {
      console.log('📋 GET ALL MEDIA REQUEST:', {
        query: req.query,
        timestamp: new Date().toISOString()
      });

      const { 
        type, 
        status, 
        event, 
        search, 
        page = 1, 
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      let query = 'SELECT * FROM media WHERE 1=1';
      const params = [];

      // Add filters
      if (type && type !== 'all') {
        query += ' AND type = ?';
        params.push(type);
      }

      if (status && status !== 'all') {
        query += ' AND status = ?';
        params.push(status);
      }

      if (event) {
        query += ' AND event LIKE ?';
        params.push(`%${event}%`);
      }

      if (search) {
        query += ' AND (name LIKE ? OR subtitle LIKE ? OR content LIKE ? OR event LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Add sorting
      const allowedSortFields = ['id', 'name', 'type', 'event', 'date', 'status', 'created_at', 'updated_at'];
      const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
      const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortField} ${sortDirection}`;

      // Add pagination (avoid placeholders for LIMIT/OFFSET to prevent stmt_execute errors)
      const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
      const safePage = Math.max(1, parseInt(page, 10) || 1);
      const safeOffset = (safePage - 1) * safeLimit;
      query += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

      console.log('🔍 EXECUTING QUERY:', { query, params });

      const [rows] = await db.execute(query, params);

      // Parse JSON fields with error handling
      const media = rows.map(parseMediaFields);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM media WHERE 1=1';
      const countParams = [];

      if (type && type !== 'all') {
        countQuery += ' AND type = ?';
        countParams.push(type);
      }

      if (status && status !== 'all') {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      if (event) {
        countQuery += ' AND event LIKE ?';
        countParams.push(`%${event}%`);
      }

      if (search) {
        countQuery += ' AND (name LIKE ? OR subtitle LIKE ? OR content LIKE ? OR event LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      const [countResult] = await db.execute(countQuery, countParams);
      const total = countResult[0]?.total || 0;

      console.log('✅ MEDIA RETRIEVED:', {
        count: media.length,
        total: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });

      res.json({
        success: true,
        data: media,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('❌ GET ALL MEDIA ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve media',
        message: error.message
      });
    }
  },

  // Get single media by ID
  getMediaById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📋 GET MEDIA BY ID:', { id });

      const [rows] = await db.execute('SELECT * FROM media WHERE id = ?', [id]);
      console.log('📊 RAW QUERY RESULT:', { rowsLength: rows.length, firstRow: rows[0] });

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Media not found'
        });
      }

      const media = parseMediaFields(rows[0]);
      console.log('📋 PARSED MEDIA:', media);

      console.log('✅ MEDIA FOUND:', { id, name: media.name });

      res.json({
        success: true,
        data: media
      });
    } catch (error) {
      console.error('❌ GET MEDIA BY ID ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve media',
        message: error.message
      });
    }
  },

  // Get images in a folder
  getFolderImages: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📁 GET FOLDER IMAGES:', { folderId: id });

      // First check if the folder exists
      const [folderRows] = await db.execute('SELECT * FROM media WHERE id = ? AND type = "folder"', [id]);
      
      if (folderRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Folder not found'
        });
      }

      const folder = parseMediaFields(folderRows[0]);

      // Get all images related to this folder
      // Check if this folder has additional_media_urls (uploaded files)
      let images = [];
      
      if (folder.additional_media_urls && folder.additional_media_urls.length > 0) {
        // Create virtual image objects from additional_media_urls
        images = folder.additional_media_urls.map((url, index) => ({
          id: `${folder.id}-${index + 1}`,
          name: `Image ${index + 1}`,
          type: 'image',
          cover_image_url: url,
          thumbnail_url: url,
          event: folder.event,
          created_at: folder.created_at,
          parent_folder_id: folder.id
        }));
      } else {
        // Fallback: get images with the same event as the folder
        const [imageRows] = await db.execute(
          'SELECT * FROM media WHERE type = "image" AND event = ? ORDER BY created_at DESC',
          [folder.event]
        );
        images = imageRows.map(parseMediaFields);
      }


      console.log('✅ FOLDER IMAGES RETRIEVED:', {
        folderId: id,
        folderName: folder.name,
        imageCount: images.length
      });

      res.json({
        success: true,
        data: {
          folder: folder,
          images: images
        }
      });
    } catch (error) {
      console.error('❌ GET FOLDER IMAGES ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve folder images',
        message: error.message
      });
    }
  },

  // Create new media
  createMedia: async (req, res) => {
    try {
      console.log('📝 CREATE MEDIA REQUEST:', {
        body: req.body,
        files: req.files ? Object.keys(req.files) : [],
        timestamp: new Date().toISOString()
      });

      const {
        name,
        subtitle,
        content,
        type = 'image',
        event,
        date,
        cover_image_url: bodyImageUrl,
        theme_color = '#A855F7',
        keywords = [],
        status = 'draft',
        items_count,
        additional_media_urls: bodyAdditionalUrls = []
      } = req.body;

      // Validate required fields
      if (!name || !event || !date) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['name', 'event', 'date']
        });
      }

      let cover_image_url = bodyImageUrl || null;
      let thumbnail_url = bodyImageUrl || null;
      let file_key = null;
      let additional_media_urls = Array.isArray(bodyAdditionalUrls) ? bodyAdditionalUrls : [];

      console.log('🔗 RECEIVED URLS:', {
        bodyImageUrl,
        cover_image_url,
        bodyAdditionalUrls,
        additional_media_urls
      });

      // Handle file uploads if AWS is configured
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // Handle cover image upload
        if (req.files && req.files.coverImage) {
          const coverFile = req.files.coverImage[0];
          const coverKey = `media/covers/${uuidv4()}_${coverFile.originalname}`;
          
          const coverUpload = new Upload({
            client: s3Client,
            params: {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: coverKey,
              Body: coverFile.buffer,
              ContentType: coverFile.mimetype,
              ACL: 'public-read'
            }
          });

          const coverResult = await coverUpload.done();
          cover_image_url = coverResult.Location;
          thumbnail_url = coverResult.Location; // Can be optimized later
          file_key = coverKey;
          
          console.log('📸 Cover image uploaded:', coverKey);
        }

        // Handle additional media uploads
        if (req.files && req.files.additionalMedia) {
          const additionalFiles = req.files.additionalMedia;
          const uploadPromises = additionalFiles.map(async (file) => {
            const fileKey = `media/additional/${uuidv4()}_${file.originalname}`;
            
            const upload = new Upload({
              client: s3Client,
              params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
              }
            });

            const result = await upload.done();
            return result.Location;
          });

          additional_media_urls = await Promise.all(uploadPromises);
          console.log('📁 Additional media uploaded:', additional_media_urls.length);
        }
      } else {
        console.log('⚠️ AWS not configured - skipping file uploads');
      }

      // Insert into database
      const insertQuery = `
        INSERT INTO media (
          name, subtitle, content, type, event, date, 
          cover_image_url, thumbnail_url, theme_color, 
          keywords, additional_media_urls, status, 
          items_count, file_key
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute(insertQuery, [
        name,
        subtitle || null,
        content || null,
        type,
        event,
        date,
        cover_image_url,
        thumbnail_url,
        theme_color,
        JSON.stringify(Array.isArray(keywords) ? keywords : []),
        JSON.stringify(additional_media_urls),
        status,
        type === 'folder' ? (items_count || 0) : null,
        file_key
      ]);

      const mediaId = result.insertId;

      // Retrieve the created media
      const [selRows] = await db.execute('SELECT * FROM media WHERE id = ?', [mediaId]);
      const mediaItem = selRows[0];
      
      // Use the existing parseMediaFields helper function
      const createdMedia = parseMediaFields(mediaItem);

      console.log('✅ MEDIA CREATED:', {
        id: mediaId,
        name: createdMedia.name,
        type: createdMedia.type
      });

      res.status(201).json({
        success: true,
        data: createdMedia,
        message: 'Media created successfully'
      });

    } catch (error) {
      console.error('❌ CREATE MEDIA ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create media',
        message: error.message
      });
    }
  },

  // Update media
  updateMedia: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📝 UPDATE MEDIA REQUEST:', {
        id,
        body: req.body,
        files: req.files ? Object.keys(req.files) : []
      });

      // Check if media exists
      const [existingRows] = await db.execute('SELECT * FROM media WHERE id = ?', [id]);
      if (existingRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Media not found'
        });
      }

      const existingMedia = existingRows[0];
      console.log('📄 EXISTING MEDIA FOUND:', {
        id: existingMedia.id,
        name: existingMedia.name,
        hasCoverImage: !!existingMedia.cover_image_url
      });
      const {
        name,
        subtitle,
        content,
        type,
        event,
        date,
        theme_color,
        keywords,
        status,
        items_count
      } = req.body;

      let cover_image_url = existingMedia.cover_image_url;
      let thumbnail_url = existingMedia.thumbnail_url;
      let file_key = existingMedia.file_key;
      let additional_media_urls = existingMedia.additional_media_urls ? JSON.parse(existingMedia.additional_media_urls) : [];

      // Handle file uploads if AWS is configured
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // Handle new cover image upload
        if (req.files && req.files.coverImage) {
          // Delete old cover image if exists
          if (existingMedia.file_key) {
            try {
              const deleteCommand = new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: existingMedia.file_key
              });
              await s3Client.send(deleteCommand);
              console.log('🗑️ Old cover image deleted:', existingMedia.file_key);
            } catch (deleteError) {
              console.warn('⚠️ Failed to delete old cover image:', deleteError.message);
            }
          }

          // Upload new cover image
          const coverFile = req.files.coverImage[0];
          const coverKey = `media/covers/${uuidv4()}_${coverFile.originalname}`;
          
          const coverUpload = new Upload({
            client: s3Client,
            params: {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: coverKey,
              Body: coverFile.buffer,
              ContentType: coverFile.mimetype,
              ACL: 'public-read'
            }
          });

          const coverResult = await coverUpload.done();
          cover_image_url = coverResult.Location;
          thumbnail_url = coverResult.Location;
          file_key = coverKey;
          
          console.log('📸 New cover image uploaded:', coverKey);
        }

        // Handle additional media uploads
        if (req.files && req.files.additionalMedia) {
          const additionalFiles = req.files.additionalMedia;
          const uploadPromises = additionalFiles.map(async (file) => {
            const fileKey = `media/additional/${uuidv4()}_${file.originalname}`;
            
            const upload = new Upload({
              client: s3Client,
              params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
              }
            });

            const result = await upload.done();
            return result.Location;
          });

          const newAdditionalUrls = await Promise.all(uploadPromises);
          additional_media_urls = [...additional_media_urls, ...newAdditionalUrls];
          console.log('📁 Additional media uploaded:', newAdditionalUrls.length);
        }
      }

      // Update database
      const updateQuery = `
        UPDATE media SET 
          name = ?, subtitle = ?, content = ?, type = ?, event = ?, date = ?,
          cover_image_url = ?, thumbnail_url = ?, theme_color = ?,
          keywords = ?, additional_media_urls = ?, status = ?,
          items_count = ?, file_key = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await db.execute(updateQuery, [
        name || existingMedia.name,
        subtitle !== undefined ? subtitle : existingMedia.subtitle,
        content !== undefined ? content : existingMedia.content,
        type || existingMedia.type,
        event || existingMedia.event,
        date || existingMedia.date,
        cover_image_url,
        thumbnail_url,
        theme_color || existingMedia.theme_color,
        JSON.stringify(keywords ? (Array.isArray(keywords) ? keywords : []) : JSON.parse(existingMedia.keywords || '[]')),
        JSON.stringify(additional_media_urls),
        status || existingMedia.status,
        (type || existingMedia.type) === 'folder' ? (items_count !== undefined ? items_count : existingMedia.items_count) : null,
        file_key,
        id
      ]);

      // Retrieve updated media
      const [updatedRows] = await db.execute('SELECT * FROM media WHERE id = ?', [id]);
      const updatedItem = updatedRows[0];
      
      // Use the existing parseMediaFields helper function
      const updatedMedia = parseMediaFields(updatedItem);

      console.log('✅ MEDIA UPDATED:', {
        id,
        name: updatedMedia.name
      });

      res.json({
        success: true,
        data: updatedMedia,
        message: 'Media updated successfully'
      });

    } catch (error) {
      console.error('❌ UPDATE MEDIA ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update media',
        message: error.message
      });
    }
  },

  // Delete media
  deleteMedia: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('🗑️ DELETE MEDIA REQUEST:', { id });

      // Check if media exists
      const [existingRows] = await db.execute('SELECT * FROM media WHERE id = ?', [id]);
      if (existingRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Media not found'
        });
      }

      const existingMedia = existingRows[0];

      // Delete files from S3 if AWS is configured
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        const filesToDelete = [];

        // Add cover image to deletion list
        if (existingMedia.file_key) {
          filesToDelete.push(existingMedia.file_key);
        }

        // Add additional media files to deletion list
        if (existingMedia.additional_media_urls) {
          try {
            let additionalUrls = [];
            if (Array.isArray(existingMedia.additional_media_urls)) {
              additionalUrls = existingMedia.additional_media_urls;
            } else if (typeof existingMedia.additional_media_urls === 'string' && existingMedia.additional_media_urls.trim()) {
              additionalUrls = JSON.parse(existingMedia.additional_media_urls);
            }
            
            // Extract S3 keys from URLs (assuming AWS S3 URLs)
            additionalUrls.forEach(url => {
              if (url.includes('.amazonaws.com/')) {
                const key = url.split('.amazonaws.com/')[1];
                filesToDelete.push(key);
              }
            });
          } catch (error) {
            console.warn('Failed to parse additional_media_urls for deletion:', error.message);
          }
        }

        // Delete files from S3
        for (const fileKey of filesToDelete) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: fileKey
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ File deleted from S3:', fileKey);
          } catch (deleteError) {
            console.warn('⚠️ Failed to delete file from S3:', fileKey, deleteError.message);
          }
        }
      }

      // Delete from database
      await db.execute('DELETE FROM media WHERE id = ?', [id]);

      console.log('✅ MEDIA DELETED:', {
        id,
        name: existingMedia.name
      });

      res.json({
        success: true,
        message: 'Media deleted successfully',
        deleted: {
          id: parseInt(id),
          name: existingMedia.name
        }
      });

    } catch (error) {
      console.error('❌ DELETE MEDIA ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete media',
        message: error.message
      });
    }
  },

  // Get media statistics
  getMediaStats: async (req, res) => {
    try {
      console.log('📊 GET MEDIA STATS REQUEST');

      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN type = 'image' THEN 1 ELSE 0 END) as images,
          SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos,
          SUM(CASE WHEN type = 'folder' THEN 1 ELSE 0 END) as folders,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts
        FROM media
      `;

      const [statsRows] = await db.execute(statsQuery);
      const stats = statsRows[0] || { total: 0, images: 0, videos: 0, folders: 0, published: 0, drafts: 0 };

      // Get recent media
      const [recentRows] = await db.execute(
        'SELECT id, name, type, status, created_at FROM media ORDER BY created_at DESC LIMIT 5'
      );

      console.log('✅ MEDIA STATS RETRIEVED:', stats);

      res.json({
        success: true,
        data: {
          stats: {
            total: parseInt(stats.total),
            images: parseInt(stats.images),
            videos: parseInt(stats.videos),
            folders: parseInt(stats.folders),
            published: parseInt(stats.published),
            drafts: parseInt(stats.drafts)
          },
          recent: recentRows
        }
      });

    } catch (error) {
      console.error('❌ GET MEDIA STATS ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve media statistics',
        message: error.message
      });
    }
  },

  // Get available events
  getEvents: async (req, res) => {
    try {
      console.log('📅 GET EVENTS REQUEST');

      const eventsQuery = `
        SELECT DISTINCT event 
        FROM media 
        WHERE event IS NOT NULL AND event != '' 
        ORDER BY event
      `;

      const [evRows] = await db.execute(eventsQuery);
      const events = evRows.map(row => row.event);

      console.log('✅ EVENTS RETRIEVED:', events.length, 'events');

      res.json({
        success: true,
        data: events
      });

    } catch (error) {
      console.error('❌ GET EVENTS ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve events',
        message: error.message
      });
    }
  },

  // Batch create multiple media items
  batchCreateMedia: async (req, res) => {
    try {
      const { mediaItems } = req.body;
      console.log('📦 BATCH CREATE MEDIA REQUEST:', {
        count: mediaItems?.length || 0,
        timestamp: new Date().toISOString()
      });

      if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid mediaItems array'
        });
      }

      const createdItems = [];
      const errors = [];

      // Process each media item
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        try {
          const {
            name,
            subtitle = null,
            content = null,
            type = 'image',
            event,
            date,
            cover_image_url,
            thumbnail_url = cover_image_url,
            theme_color = '#A855F7',
            keywords = [],
            additional_media_urls = [],
            status = 'published',
            items_count = null,
            file_key = null
          } = item;

          // Validate required fields
          if (!name || !event || !date || !cover_image_url) {
            errors.push({
              index: i,
              item: name || `Item ${i + 1}`,
              error: 'Missing required fields: name, event, date, cover_image_url'
            });
            continue;
          }

          // Insert into database
          const insertQuery = `
            INSERT INTO media (
              name, subtitle, content, type, event, date, 
              cover_image_url, thumbnail_url, theme_color, 
              keywords, additional_media_urls, status, 
              items_count, file_key
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const result = await db.query(insertQuery, [
            name,
            subtitle,
            content,
            type,
            event,
            date,
            cover_image_url,
            thumbnail_url,
            theme_color,
            JSON.stringify(Array.isArray(keywords) ? keywords : []),
            JSON.stringify(additional_media_urls),
            status,
            type === 'folder' ? (items_count || 0) : null,
            file_key
          ]);

          const mediaId = result.insertId;
          
          createdItems.push({
            id: mediaId,
            name,
            cover_image_url,
            type,
            event
          });

          console.log(`✅ BATCH ITEM ${i + 1} CREATED:`, { id: mediaId, name });

        } catch (itemError) {
          console.error(`❌ BATCH ITEM ${i + 1} ERROR:`, itemError);
          errors.push({
            index: i,
            item: item.name || `Item ${i + 1}`,
            error: itemError.message
          });
        }
      }

      console.log('📦 BATCH CREATE COMPLETED:', {
        total: mediaItems.length,
        success: createdItems.length,
        errors: errors.length
      });

      res.json({
        success: true,
        data: {
          created: createdItems,
          errors: errors,
          summary: {
            total: mediaItems.length,
            success: createdItems.length,
            failed: errors.length
          }
        },
        message: `Batch created ${createdItems.length}/${mediaItems.length} media items`
      });

    } catch (error) {
      console.error('❌ BATCH CREATE MEDIA ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to batch create media',
        message: error.message
      });
    }
  },

  // Get popular keywords
  getPopularKeywords: async (req, res) => {
    try {
      console.log('🏷️ GET POPULAR KEYWORDS REQUEST');

      const keywordsQuery = `
        SELECT keywords 
        FROM media 
        WHERE keywords IS NOT NULL AND keywords != '' AND keywords != '[]'
      `;

      const rows = await db.query(keywordsQuery);
      const allKeywords = [];

      // Parse keywords from various formats
      rows.forEach(row => {
        try {
          if (row.keywords) {
            let keywords = [];
            
            // Handle different keyword formats
            if (Array.isArray(row.keywords)) {
              keywords = row.keywords;
            } else if (typeof row.keywords === 'string' && row.keywords.startsWith('[') && row.keywords.endsWith(']')) {
              try {
                // Try JSON.parse first
                keywords = JSON.parse(row.keywords);
              } catch (jsonErr) {
                // If JSON.parse fails, try manual parsing for format like "[ 'item1', 'item2' ]"
                const keywordStr = row.keywords
                  .replace(/^\[|\]$/g, '') // Remove [ ]
                  .replace(/'/g, '"') // Replace single quotes with double quotes
                  .split(',')
                  .map(k => k.trim().replace(/^"|"$/g, '')) // Remove quotes and trim
                  .filter(k => k.length > 0);
                keywords = keywordStr;
              }
            } else if (typeof row.keywords === 'string' && row.keywords.includes(',')) {
              // Handle comma-separated string
              keywords = row.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
            } else if (typeof row.keywords === 'string') {
              // Single keyword
              keywords = [row.keywords.trim()];
            }
            
            allKeywords.push(...keywords);
            console.log('✅ Parsed keywords:', keywords, 'from:', row.keywords);
          }
        } catch (err) {
          console.warn('❌ Error parsing keywords:', row.keywords, err.message);
        }
      });

      // Count keyword frequency
      const keywordCounts = {};
      allKeywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });

      // Sort by frequency and get top 20
      const popularKeywords = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([keyword, count]) => ({ keyword, count }));

      console.log('✅ POPULAR KEYWORDS RETRIEVED:', popularKeywords.length, 'keywords');

      res.json({
        success: true,
        data: popularKeywords
      });

    } catch (error) {
      console.error('❌ GET POPULAR KEYWORDS ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve popular keywords',
        message: error.message
      });
    }
  }
};

module.exports = MediaController;