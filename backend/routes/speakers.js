const express = require('express');
const multer = require('multer');
const SpeakerController = require('../controllers/speakerController');

const router = express.Router();

// การตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      // รูปภาพ
      const allowedImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('รูปภาพต้องเป็นไฟล์ JPEG, PNG, GIF หรือ WebP เท่านั้น'), false);
      }
    } else if (file.fieldname === 'pdf') {
      // ไฟล์ PDF
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('ต้องเป็นไฟล์ PDF เท่านั้น'), false);
      }
    } else {
      cb(new Error('ไฟล์ไม่ถูกต้อง'), false);
    }
  }
});

// การตั้งค่า fields สำหรับ multer
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// Error handling middleware สำหรับ multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      error: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

// 🔗 Routes

// GET /api/speakers - ดึงรายการผู้บรรยายทั้งหมด
router.get('/', SpeakerController.getAllSpeakers);

// GET /api/speakers/:id - ดึงข้อมูลผู้บรรยายตาม ID
router.get('/:id', SpeakerController.getSpeakerById);

// POST /api/speakers - สร้างผู้บรรยายใหม่ (พร้อมอัปโหลดไฟล์)
router.post('/', uploadFields, handleMulterError, SpeakerController.createSpeaker);

// PUT /api/speakers/:id - อัปเดตข้อมูลผู้บรรยาย (พร้อมอัปโหลดไฟล์)
router.put('/:id', uploadFields, handleMulterError, SpeakerController.updateSpeaker);

// DELETE /api/speakers/:id - ลบผู้บรรยาย (soft delete)
router.delete('/:id', SpeakerController.deleteSpeaker);

// DELETE /api/speakers/:id/permanent - ลบผู้บรรยายอย่างถาวร (รวมไฟล์ใน S3)
router.delete('/:id/permanent', SpeakerController.permanentDeleteSpeaker);

module.exports = router;