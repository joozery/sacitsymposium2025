const db = require('../db/db');
const { s3Client } = require('../aws-config-v3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const FolderImagesController = {
  // Get all images for a specific folder
  getFolderImages: async (req, res) => {
    try {
      const { folderId } = req.params;
      console.log('📁 GET FOLDER IMAGES:', { folderId });

      // First check if folder exists
      const [folderRows] = await db.execute('SELECT * FROM media WHERE id = ? AND type = "folder"', [folderId]);
      
      if (folderRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Folder not found'
        });
      }

      const folder = folderRows[0];

      // Get all images for this folder
      const [imageRows] = await db.execute(
        'SELECT * FROM folder_images WHERE folder_id = ? ORDER BY upload_date DESC',
        [folderId]
      );

      const images = imageRows.map(image => ({
        ...image,
        keywords: image.keywords ? (typeof image.keywords === 'string' ? JSON.parse(image.keywords) : image.keywords) : []
      }));

      console.log('✅ FOLDER IMAGES RETRIEVED:', {
        folderId,
        folderName: folder.name,
        imageCount: images.length
      });

      res.json({
        success: true,
        data: {
          folder: folder,
          images: images,
          total: images.length
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

  // Add single image to folder
  addImageToFolder: async (req, res) => {
    try {
      const { folderId } = req.params;
      const {
        name,
        subtitle = null,
        description = null,
        image_url,
        thumbnail_url = image_url,
        file_key = null,
        file_size = null,
        file_type = 'image/jpeg',
        keywords = []
      } = req.body;

      console.log('📸 ADD IMAGE TO FOLDER:', { folderId, name, image_url });

      // Validate required fields
      if (!name || !image_url) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, image_url'
        });
      }

      // Check if folder exists
      const [folderRows] = await db.execute('SELECT * FROM media WHERE id = ? AND type = "folder"', [folderId]);
      
      if (folderRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Folder not found'
        });
      }

      // Insert image into folder_images table
      const insertQuery = `
        INSERT INTO folder_images (
          folder_id, name, subtitle, description, 
          image_url, thumbnail_url, file_key, 
          file_size, file_type, keywords
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute(insertQuery, [
        folderId,
        name,
        subtitle,
        description,
        image_url,
        thumbnail_url,
        file_key,
        file_size,
        file_type,
        JSON.stringify(Array.isArray(keywords) ? keywords : [])
      ]);

      const imageId = result.insertId;

      // Update folder items_count
      await db.execute(
        'UPDATE media SET items_count = (SELECT COUNT(*) FROM folder_images WHERE folder_id = ?) WHERE id = ?',
        [folderId, folderId]
      );

      console.log('✅ IMAGE ADDED TO FOLDER:', { imageId, folderId, name });

      res.json({
        success: true,
        data: {
          id: imageId,
          folder_id: folderId,
          name,
          image_url,
          thumbnail_url,
          file_type
        },
        message: 'Image added to folder successfully'
      });

    } catch (error) {
      console.error('❌ ADD IMAGE TO FOLDER ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add image to folder',
        message: error.message
      });
    }
  },

  // Batch add multiple images to folder
  batchAddImagesToFolder: async (req, res) => {
    try {
      const { folderId } = req.params;
      const { images } = req.body;

      console.log('📦 BATCH ADD IMAGES TO FOLDER:', { folderId, count: images?.length || 0 });

      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid images array'
        });
      }

      // Check if folder exists
      const [folderRows] = await db.execute('SELECT * FROM media WHERE id = ? AND type = "folder"', [folderId]);
      
      if (folderRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Folder not found'
        });
      }

      const createdImages = [];
      const errors = [];

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
          const {
            name,
            subtitle = null,
            description = null,
            image_url,
            thumbnail_url = image_url,
            file_key = null,
            file_size = null,
            file_type = 'image/jpeg',
            keywords = []
          } = image;

          // Validate required fields
          if (!name || !image_url) {
            errors.push({
              index: i,
              image: name || `Image ${i + 1}`,
              error: 'Missing required fields: name, image_url'
            });
            continue;
          }

          // Insert image
          const insertQuery = `
            INSERT INTO folder_images (
              folder_id, name, subtitle, description, 
              image_url, thumbnail_url, file_key, 
              file_size, file_type, keywords
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const [result] = await db.execute(insertQuery, [
            folderId,
            name,
            subtitle,
            description,
            image_url,
            thumbnail_url,
            file_key,
            file_size,
            file_type,
            JSON.stringify(Array.isArray(keywords) ? keywords : [])
          ]);

          const imageId = result.insertId;
          
          createdImages.push({
            id: imageId,
            folder_id: folderId,
            name,
            image_url,
            thumbnail_url
          });

          console.log(`✅ BATCH IMAGE ${i + 1} CREATED:`, { id: imageId, name });

        } catch (imageError) {
          console.error(`❌ BATCH IMAGE ${i + 1} ERROR:`, imageError);
          errors.push({
            index: i,
            image: image.name || `Image ${i + 1}`,
            error: imageError.message
          });
        }
      }

      // Update folder items_count
      await db.execute(
        'UPDATE media SET items_count = (SELECT COUNT(*) FROM folder_images WHERE folder_id = ?) WHERE id = ?',
        [folderId, folderId]
      );

      console.log('📦 BATCH ADD COMPLETED:', {
        folderId,
        total: images.length,
        success: createdImages.length,
        errors: errors.length
      });

      res.json({
        success: true,
        data: {
          created: createdImages,
          errors: errors,
          summary: {
            total: images.length,
            success: createdImages.length,
            failed: errors.length
          }
        },
        message: `Batch added ${createdImages.length}/${images.length} images to folder`
      });

    } catch (error) {
      console.error('❌ BATCH ADD IMAGES ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to batch add images to folder',
        message: error.message
      });
    }
  },

  // Delete image from folder
  deleteImageFromFolder: async (req, res) => {
    try {
      const { folderId, imageId } = req.params;
      console.log('🗑️ DELETE IMAGE FROM FOLDER:', { folderId, imageId });

      // Get image details first
      const [imageRows] = await db.execute(
        'SELECT * FROM folder_images WHERE id = ? AND folder_id = ?',
        [imageId, folderId]
      );

      if (imageRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Image not found in folder'
        });
      }

      const image = imageRows[0];

      // Delete from S3 if file_key exists
      if (image.file_key) {
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: image.file_key
          });
          await s3Client.send(deleteCommand);
          console.log('🗑️ S3 FILE DELETED:', image.file_key);
        } catch (s3Error) {
          console.warn('⚠️ S3 DELETE WARNING:', s3Error.message);
        }
      }

      // Delete from database
      await db.execute('DELETE FROM folder_images WHERE id = ? AND folder_id = ?', [imageId, folderId]);

      // Update folder items_count
      await db.execute(
        'UPDATE media SET items_count = (SELECT COUNT(*) FROM folder_images WHERE folder_id = ?) WHERE id = ?',
        [folderId, folderId]
      );

      console.log('✅ IMAGE DELETED FROM FOLDER:', { imageId, folderId });

      res.json({
        success: true,
        message: 'Image deleted from folder successfully'
      });

    } catch (error) {
      console.error('❌ DELETE IMAGE FROM FOLDER ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete image from folder',
        message: error.message
      });
    }
  },

  // Migrate images from media table to folder_images table
  migrateFromMediaTable: async (req, res) => {
    try {
      console.log('🔄 MIGRATE FROM MEDIA TABLE REQUEST');

      // Get all images from media table
      const [imageRows] = await db.execute('SELECT * FROM media WHERE type = "image" ORDER BY created_at ASC');
      
      if (imageRows.length === 0) {
        return res.json({
          success: true,
          data: {
            migrated: 0,
            errors: [],
            message: 'No images found in media table to migrate'
          }
        });
      }

      // Get folder mappings
      const [folderRows] = await db.execute('SELECT id, name, event FROM media WHERE type = "folder"');
      const folderMap = {};
      folderRows.forEach(folder => {
        folderMap[folder.event] = folder.id;
      });

      const migratedImages = [];
      const errors = [];

      // Migrate each image
      for (const image of imageRows) {
        try {
          const folderId = folderMap[image.event];
          
          if (!folderId) {
            errors.push({
              imageId: image.id,
              imageName: image.name,
              event: image.event,
              error: 'No folder found for event'
            });
            continue;
          }

          // Insert into folder_images table
          const [result] = await db.execute(`
            INSERT INTO folder_images (
              folder_id, name, subtitle, description,
              image_url, thumbnail_url, file_key,
              file_type, keywords, upload_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            folderId,
            image.name,
            image.subtitle,
            image.content,
            image.cover_image_url,
            image.thumbnail_url,
            image.file_key,
            'image/jpeg',
            JSON.stringify(image.keywords || []),
            image.date || image.created_at
          ]);

          migratedImages.push({
            oldId: image.id,
            newId: result.insertId,
            name: image.name,
            folderId: folderId
          });

        } catch (imageError) {
          errors.push({
            imageId: image.id,
            imageName: image.name,
            error: imageError.message
          });
        }
      }

      // Update folder items_count
      for (const folder of folderRows) {
        await db.execute(
          'UPDATE media SET items_count = (SELECT COUNT(*) FROM folder_images WHERE folder_id = ?) WHERE id = ?',
          [folder.id, folder.id]
        );
      }

      console.log('✅ MIGRATION COMPLETED:', {
        migrated: migratedImages.length,
        errors: errors.length
      });

      res.json({
        success: true,
        data: {
          migrated: migratedImages.length,
          migratedImages: migratedImages,
          errors: errors,
          updatedFolders: folderRows.length
        },
        message: `Successfully migrated ${migratedImages.length} images to folder_images table`
      });

    } catch (error) {
      console.error('❌ MIGRATE FROM MEDIA TABLE ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to migrate images from media table',
        message: error.message
      });
    }
  }
};

module.exports = FolderImagesController;