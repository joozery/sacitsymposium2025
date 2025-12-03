const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const router = express.Router();
const storage = multer.memoryStorage();

// Configure multer with file size limits
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed.'), false);
    }
  }
});

// AWS Config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Single file upload (backward compatibility)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Determine file folder based on type
    const isImage = file.mimetype.startsWith('image/');
    const isPdf = file.mimetype === 'application/pdf';
    
    let folder = 'uploads';
    if (isImage) folder = 'exhibitions/images';
    else if (isPdf) folder = 'exhibitions/documents';

    const fileKey = `${folder}/${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    // S3 Upload - ENABLED
    const data = await s3.upload(params).promise();
    console.log('📁 FILE UPLOADED TO S3:', {
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      folder: folder,
      s3Url: data.Location
    });
    
    const fileUrl = data.Location;
    
    res.json({ 
      success: true,
      fileUrl: fileUrl,
      fileKey: fileKey,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      isImage: isImage,
      isPdf: isPdf,
      s3Location: data.Location
    });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    if (err.message.includes('Invalid file type')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
});

// Multiple files upload for exhibitions
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map(async (file) => {
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      
      let folder = 'uploads';
      if (isImage) folder = 'exhibitions/images';
      else if (isPdf) folder = 'exhibitions/documents';

      const fileKey = `${folder}/${uuidv4()}_${file.originalname}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      // TEMPORARILY DISABLED: S3 Upload (using mock response)
      // const data = await s3.upload(params).promise();
      console.log('📁 MOCK MULTIPLE FILE UPLOAD:', file.originalname);
      const mockUrl = `https://mock-s3-bucket.s3.amazonaws.com/${fileKey}`;
      
      return {
        fileUrl: mockUrl,
        fileKey: fileKey,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        isImage: isImage,
        isPdf: isPdf
      };
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    res.json({ 
      success: true,
      files: uploadResults,
      count: uploadResults.length
    });
  } catch (err) {
    console.error('S3 Multiple Upload Error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete file from S3 (using query parameter to handle file paths safely)
router.delete('/delete', async (req, res) => {
  try {
    const fileKey = req.query.key;
    
    if (!fileKey) {
      return res.status(400).json({ error: 'File key is required in query parameter' });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    // TEMPORARILY DISABLED: S3 Delete (using mock response)
    // await s3.deleteObject(params).promise();
    console.log('🗑️ MOCK FILE DELETE:', fileKey);
    
    res.json({ 
      success: true,
      message: 'File deleted successfully (MOCK)',
      fileKey: fileKey,
      note: 'MOCK DELETE - S3 disabled for testing'
    });
  } catch (err) {
    console.error('S3 Delete Error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
