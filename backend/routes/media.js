const express = require('express');
const multer = require('multer');
const MediaController = require('../controllers/mediaController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 100, // Maximum 100 files
    fieldSize: 10 * 1024 * 1024, // 10MB field size
    fieldNameSize: 100, // Field name size
    fieldValueSize: 10 * 1024 * 1024, // Field value size
    parts: 1000, // Maximum number of parts
    headerPairs: 2000 // Maximum number of header key=>value pairs
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 MULTER FILE FILTER (MEDIA):', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv',
      // Documents (for folder contents)
      'application/pdf'
    ];
    
    const isAllowed = allowedMimeTypes.includes(file.mimetype);
    console.log('✅ MEDIA FILE FILTER RESULT:', {
      isAllowed: isAllowed,
      mimetype: file.mimetype,
      allowedTypes: allowedMimeTypes
    });
    
    cb(isAllowed ? null : new Error(`Invalid file type: ${file.mimetype}`), isAllowed);
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  console.error('❌ MULTER ERROR (MEDIA):', {
    message: error.message,
    code: error.code,
    field: error.field,
    storageErrors: error.storageErrors
  });
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'File too large',
        message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB ต่อไฟล์)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false,
        error: 'Too many files',
        message: 'อัปโหลดไฟล์ได้สูงสุด 20 ไฟล์'
      });
    }
    return res.status(400).json({ 
      success: false,
      error: 'Upload error',
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      details: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      error: 'File validation error',
      message: error.message
    });
  }
  
  next();
};

// Configure multer fields for media uploads
const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },        // Cover image
  { name: 'additionalMedia', maxCount: 15 }   // Additional media files
]);

// Routes

/**
 * @route GET /api/media
 * @desc Get all media with optional filtering and pagination
 * @query {string} type - Filter by media type (image, video, folder)
 * @query {string} status - Filter by status (draft, published)
 * @query {string} event - Filter by event name
 * @query {string} search - Search in name, subtitle, content, event
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} sort_by - Sort field (default: created_at)
 * @query {string} sort_order - Sort order ASC/DESC (default: DESC)
 */
router.get('/', MediaController.getAllMedia);

/**
 * @route GET /api/media/stats
 * @desc Get media statistics
 */
router.get('/stats', MediaController.getMediaStats);

/**
 * @route GET /api/media/events
 * @desc Get available events (alias for search/events)
 */
router.get('/events', MediaController.getEvents);

/**
 * @route GET /api/media/keywords  
 * @desc Get popular keywords (alias for search/keywords)
 */
router.get('/keywords', MediaController.getPopularKeywords);

/**
 * @route GET /api/media/:id/images
 * @desc Get images in a folder by folder ID
 * @param {number} id - Folder ID
 */
router.get('/:id/images', MediaController.getFolderImages);

/**
 * @route GET /api/media/:id
 * @desc Get single media by ID
 * @param {number} id - Media ID
 */
router.get('/:id', MediaController.getMediaById);

/**
 * @route POST /api/media/batch
 * @desc Batch create multiple media items
 * @body {array} mediaItems - Array of media objects to create
 */
router.post('/batch', MediaController.batchCreateMedia);

/**
 * @route POST /api/media
 * @desc Create new media
 * @body {string} name - Media name (required)
 * @body {string} subtitle - Media subtitle
 * @body {string} content - Media content/description
 * @body {string} type - Media type: image, video, folder (default: image)
 * @body {string} event - Event name (required)
 * @body {string} date - Event date (required, format: YYYY-MM-DD)
 * @body {string} theme_color - Theme color (default: #A855F7)
 * @body {array} keywords - Array of keywords
 * @body {string} status - Status: draft, published (default: draft)
 * @body {number} items_count - Number of items (for folder type only)
 * @files {file} coverImage - Cover image file
 * @files {file[]} additionalMedia - Additional media files
 */
router.post('/', uploadFields, handleMulterError, MediaController.createMedia);

/**
 * @route PUT /api/media/:id
 * @desc Update media
 * @param {number} id - Media ID
 * @body {string} name - Media name
 * @body {string} subtitle - Media subtitle
 * @body {string} content - Media content/description
 * @body {string} type - Media type: image, video, folder
 * @body {string} event - Event name
 * @body {string} date - Event date (format: YYYY-MM-DD)
 * @body {string} theme_color - Theme color
 * @body {array} keywords - Array of keywords
 * @body {string} status - Status: draft, published
 * @body {number} items_count - Number of items (for folder type only)
 * @files {file} coverImage - New cover image file
 * @files {file[]} additionalMedia - Additional media files to add
 */
router.put('/:id', uploadFields, handleMulterError, MediaController.updateMedia);

/**
 * @route DELETE /api/media/:id
 * @desc Delete media
 * @param {number} id - Media ID
 */
router.delete('/:id', MediaController.deleteMedia);

// Additional utility routes

/**
 * @route GET /api/media/search/events
 * @desc Get unique event names for search suggestions
 */
router.get('/search/events', async (req, res) => {
  try {
    const db = require('../db/db');
    const [rows] = await db.execute('SELECT DISTINCT event FROM media ORDER BY event');
    const events = rows.map(row => row.event);
    
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
});

/**
 * @route GET /api/media/search/keywords
 * @desc Get popular keywords for search suggestions
 */
router.get('/search/keywords', async (req, res) => {
  try {
    const db = require('../db/db');
    const [rows] = await db.execute('SELECT keywords FROM media WHERE keywords IS NOT NULL');
    
    const allKeywords = [];
    rows.forEach(row => {
      if (row.keywords) {
        const keywords = JSON.parse(row.keywords);
        allKeywords.push(...keywords);
      }
    });
    
    // Count keyword frequency
    const keywordCount = {};
    allKeywords.forEach(keyword => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });
    
    // Sort by frequency and get top 20
    const popularKeywords = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([keyword, count]) => ({ keyword, count }));
    
    res.json({
      success: true,
      data: popularKeywords
    });
  } catch (error) {
    console.error('❌ GET KEYWORDS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve keywords',
      message: error.message
    });
  }
});

/**
 * @route PATCH /api/media/:id/status
 * @desc Update media status only
 * @param {number} id - Media ID
 * @body {string} status - New status: draft, published
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: 'Status must be either "draft" or "published"'
      });
    }
    
    const db = require('../db/db');
    
    // Check if media exists
    const [existingRows] = await db.execute('SELECT id, name FROM media WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Media not found'
      });
    }
    
    // Update status
    await db.execute('UPDATE media SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    
    console.log('✅ MEDIA STATUS UPDATED:', {
      id,
      name: existingRows[0].name,
      status
    });
    
    res.json({
      success: true,
      message: 'Media status updated successfully',
      data: {
        id: parseInt(id),
        status
      }
    });
    
  } catch (error) {
    console.error('❌ UPDATE MEDIA STATUS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update media status',
      message: error.message
    });
  }
});

module.exports = router;