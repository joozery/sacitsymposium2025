const express = require('express');
const multer = require('multer');
const { s3Client } = require('../aws-config-v3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
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
    console.log('🔍 MULTER FILE FILTER:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm',
      // Documents
      'application/pdf'
    ];
    
    const isAllowed = allowedMimeTypes.includes(file.mimetype);
    console.log('✅ FILE FILTER RESULT:', {
      isAllowed: isAllowed,
      mimetype: file.mimetype,
      allowedTypes: allowedMimeTypes
    });
    
    cb(isAllowed ? null : new Error('Invalid file type'), isAllowed);
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  console.error('❌ MULTER ERROR:', {
    message: error.message,
    code: error.code,
    field: error.field,
    storageErrors: error.storageErrors,
    body: req.body,
    files: req.files,
    file: req.file,
    headers: req.headers,
    contentType: req.headers['content-type']
  });
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large',
        message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files',
        message: 'จำนวนไฟล์เกินขีดจำกัด (สูงสุด 100 ไฟล์)'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected field',
        message: `ฟิลด์ที่ไม่คาดคิด: ${error.field}. ตรวจสอบ field name และจำนวนไฟล์`
      });
    } else if (error.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({ 
        error: 'Too many parts',
        message: 'จำนวน parts เกินขีดจำกัด (สูงสุด 1000 parts)'
      });
    }
    return res.status(400).json({ 
      error: 'Upload error',
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      details: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({ 
      error: 'File validation error',
      message: error.message
    });
  }
  
  next();
};

// Single file upload (AWS SDK v3)
router.post('/', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    console.log('📤 UPLOAD REQUEST RECEIVED:', {
      hasFile: !!req.file,
      fileField: req.file?.fieldname,
      fileName: req.file?.originalname,
      fileType: req.file?.mimetype,
      fileSize: req.file?.size,
      headers: req.headers['content-type']
    });

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const isImage = file.mimetype.startsWith('image/');
    const isPdf = file.mimetype === 'application/pdf';
    const isVideo = file.mimetype.startsWith('video/');
    
    console.log('📋 FILE ANALYSIS:', {
      fileName: file.originalname,
      fileType: file.mimetype,
      isImage: isImage,
      isPdf: isPdf,
      isVideo: isVideo,
      fileSize: file.size
    });
    
    let folder = 'uploads';
    if (isImage) folder = 'media/images';
    else if (isPdf) folder = 'media/documents';
    else if (isVideo) folder = 'media/videos';

    const fileKey = `${folder}/${uuidv4()}_${file.originalname}`;

    console.log('🚀 STARTING S3 UPLOAD:', {
      bucket: process.env.AWS_S3_BUCKET_NAME,
      key: fileKey,
      folder: folder
    });

    // AWS SDK v3 Upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });

    const result = await upload.done();
    
    console.log('📁 FILE UPLOADED TO S3 (v3):', {
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      folder: folder,
      s3Url: result.Location
    });

    res.json({ 
      success: true,
      fileUrl: result.Location,
      fileKey: fileKey,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      isImage: isImage,
      isPdf: isPdf,
      isVideo: isVideo,
      s3Location: result.Location
    });
  } catch (err) {
    console.error('❌ S3 Upload Error (v3):', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId
    });
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple files upload (AWS SDK v3)
router.post('/multiple', upload.array('files', 100), handleMulterError, async (req, res) => {
  try {
    console.log('📤 MULTIPLE UPLOAD REQUEST RECEIVED:', {
      filesCount: req.files?.length || 0,
      files: req.files?.map(f => ({ name: f.originalname, size: f.size, type: f.mimetype, fieldname: f.fieldname })),
      headers: req.headers['content-type'],
      body: req.body,
      hasFiles: !!req.files,
      hasFile: !!req.file,
      multerLimits: {
        fileSize: '10MB',
        files: 100,
        parts: 1000
      }
    });

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No files uploaded' 
      });
    }

    const uploadPromises = files.map(async (file, index) => {
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      const isVideo = file.mimetype.startsWith('video/');
      
      console.log(`📋 FILE ANALYSIS ${index + 1}:`, {
        fileName: file.originalname,
        fileType: file.mimetype,
        isImage: isImage,
        isPdf: isPdf,
        isVideo: isVideo,
        fileSize: file.size
      });
      
      let folder = 'uploads';
      if (isImage) folder = 'media/images';
      else if (isPdf) folder = 'media/documents';
      else if (isVideo) folder = 'media/videos';

      const fileKey = `${folder}/${uuidv4()}_${file.originalname}`;

      console.log(`🚀 STARTING S3 UPLOAD ${index + 1}:`, {
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: fileKey,
        folder: folder
      });

      // AWS SDK v3 Upload
      const uploadInstance = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
      });

      const result = await uploadInstance.done();
      
      console.log(`📁 FILE ${index + 1} UPLOADED TO S3 (v3):`, {
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        folder: folder,
        s3Url: result.Location
      });

      return {
        success: true,
        fileUrl: result.Location,
        fileKey: fileKey,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        isImage: isImage,
        isPdf: isPdf,
        isVideo: isVideo,
        s3Location: result.Location,
        uploadIndex: index + 1
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    console.log('✅ MULTIPLE FILES UPLOADED SUCCESSFULLY:', {
      totalFiles: uploadResults.length,
      successCount: uploadResults.filter(r => r.success).length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    });

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadResults.length} files`,
      files: uploadResults,
      count: uploadResults.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    });

  } catch (err) {
    console.error('❌ S3 Multiple Upload Error (v3):', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId
    });
    res.status(500).json({ 
      success: false,
      error: 'Multiple upload failed',
      message: err.message
    });
  }
});

// Delete file (AWS SDK v3)
router.delete('/delete', async (req, res) => {
  try {
    const fileKey = req.query.key;
    if (!fileKey) {
      return res.status(400).json({ error: 'File key required' });
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);
    console.log('🗑️ FILE DELETED FROM S3 (v3):', fileKey);
    
    res.json({ 
      success: true,
      message: 'File deleted successfully',
      fileKey: fileKey
    });
  } catch (err) {
    console.error('S3 Delete Error (v3):', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Delete multiple files (AWS SDK v3)
router.delete('/delete-multiple', async (req, res) => {
  try {
    const { fileKeys } = req.body;
    
    if (!fileKeys || !Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'File keys array required' 
      });
    }

    console.log('🗑️ MULTIPLE DELETE REQUEST:', {
      filesCount: fileKeys.length,
      fileKeys: fileKeys
    });

    const deletePromises = fileKeys.map(async (fileKey, index) => {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
        });

        await s3Client.send(deleteCommand);
        console.log(`🗑️ FILE ${index + 1} DELETED FROM S3:`, fileKey);
        
        return {
          success: true,
          fileKey: fileKey,
          message: 'Deleted successfully'
        };
      } catch (error) {
        console.error(`❌ FAILED TO DELETE FILE ${index + 1}:`, fileKey, error.message);
        return {
          success: false,
          fileKey: fileKey,
          error: error.message
        };
      }
    });

    const deleteResults = await Promise.all(deletePromises);
    const successCount = deleteResults.filter(r => r.success).length;
    const failedCount = deleteResults.filter(r => !r.success).length;
    
    console.log('✅ MULTIPLE DELETE COMPLETED:', {
      totalFiles: deleteResults.length,
      successCount: successCount,
      failedCount: failedCount
    });

    res.json({ 
      success: failedCount === 0,
      message: `Deleted ${successCount} of ${deleteResults.length} files`,
      results: deleteResults,
      summary: {
        total: deleteResults.length,
        successful: successCount,
        failed: failedCount
      }
    });

  } catch (err) {
    console.error('❌ S3 Multiple Delete Error (v3):', err);
    res.status(500).json({ 
      success: false,
      error: 'Multiple delete failed',
      message: err.message
    });
  }
});

// Multiple file upload to specific folder
router.post('/folder/:folderId', upload.array('files', 100), handleMulterError, async (req, res) => {
  try {
    const { folderId } = req.params;
    const files = req.files;
    
    console.log('📁 MULTIPLE UPLOAD TO FOLDER:', {
      folderId,
      fileCount: files?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    // Check if folder exists
    const db = require('../db/db');
    const folderRows = await db.query('SELECT * FROM media WHERE id = ? AND type = "folder"', [folderId]);
    
    if (folderRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found'
      });
    }

    const folder = folderRows[0];
    const folderName = folder.name.replace(/[^a-zA-Z0-9]/g, '_');
    const uploadFolder = `media/folders/${folderName}_${folderId}`;

    // Upload all files to S3 in parallel
    const uploadPromises = files.map(async (file, index) => {
      const fileExtension = file.originalname.split('.').pop();
      const fileKey = `${uploadFolder}/${uuidv4()}_${file.originalname}`;
      
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      const isVideo = file.mimetype.startsWith('video/');

      console.log(`🚀 STARTING S3 UPLOAD ${index + 1}:`, {
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: fileKey,
        folder: uploadFolder
      });

      // AWS SDK v3 Upload
      const uploadInstance = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
      });

      const result = await uploadInstance.done();
      
      console.log(`📁 FILE ${index + 1} UPLOADED TO S3:`, {
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        s3Url: result.Location
      });

      return {
        success: true,
        fileUrl: result.Location,
        fileKey: fileKey,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        isImage: isImage,
        isPdf: isPdf,
        isVideo: isVideo,
        s3Location: result.Location,
        uploadIndex: index + 1
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    console.log('✅ MULTIPLE FILES UPLOADED TO S3:', {
      totalFiles: uploadResults.length,
      successCount: uploadResults.filter(r => r.success).length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    });

    // Now save to folder_images table
    const imagesToSave = uploadResults.map((result, index) => ({
      name: `${folder.event} - ${result.fileName}`,
      subtitle: `รูปภาพจาก ${folder.name}`,
      description: `รูปภาพที่อัปโหลดเข้าโฟลเดอร์ ${folder.name}`,
      image_url: result.fileUrl,
      thumbnail_url: result.fileUrl,
      file_key: result.fileKey,
      file_size: result.fileSize,
      file_type: result.fileType,
      keywords: [folder.event, 'อัปโหลด', 'รูปภาพ']
    }));

    // Use the folder images controller to batch save
    const FolderImagesController = require('../controllers/folderImagesController');
    
    // Create a mock request object for the controller
    const mockReq = {
      params: { folderId },
      body: { images: imagesToSave }
    };
    
    const mockRes = {
      json: (data) => data,
      status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) })
    };

    try {
      const batchResult = await new Promise((resolve, reject) => {
        const originalJson = mockRes.json;
        mockRes.json = (data) => {
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.error || 'Batch save failed'));
          }
        };
        
        FolderImagesController.batchAddImagesToFolder(mockReq, mockRes);
      });

      console.log('💾 IMAGES SAVED TO DATABASE:', batchResult.data.summary);

      res.json({
        success: true,
        data: {
          uploadResults: uploadResults,
          databaseResults: batchResult.data,
          summary: {
            totalUploaded: uploadResults.length,
            totalSaved: batchResult.data.summary.success,
            folder: {
              id: folderId,
              name: folder.name,
              event: folder.event
            }
          }
        },
        message: `Successfully uploaded ${uploadResults.length} files and saved ${batchResult.data.summary.success} to database`
      });

    } catch (dbError) {
      console.error('❌ DATABASE SAVE ERROR:', dbError);
      
      // Files uploaded to S3 but database save failed
      res.status(207).json({
        success: false,
        error: 'Files uploaded to S3 but database save failed',
        data: {
          uploadResults: uploadResults,
          dbError: dbError.message,
          summary: {
            totalUploaded: uploadResults.length,
            totalSaved: 0,
            folder: {
              id: folderId,
              name: folder.name,
              event: folder.event
            }
          }
        }
      });
    }

  } catch (error) {
    console.error('❌ MULTIPLE UPLOAD TO FOLDER ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload files to folder',
      message: error.message
    });
  }
});

module.exports = router;
