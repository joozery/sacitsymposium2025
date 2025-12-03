const express = require('express');
const multer = require('multer');
const ExhibitionController = require('../controllers/exhibitionController');

const router = express.Router();

// การตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
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
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

// Error handler สำหรับ multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)'
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// 🔗 Routes

// GET /api/exhibitions - ดึงรายการนิทรรศการทั้งหมด
router.get('/', ExhibitionController.getAllExhibitions);

// GET /api/exhibitions/:id - ดึงข้อมูลนิทรรศการตาม ID
router.get('/:id', ExhibitionController.getExhibitionById);

// POST /api/exhibitions - สร้างนิทรรศการใหม่ (พร้อมอัปโหลดไฟล์)
router.post('/', uploadFields, handleMulterError, ExhibitionController.createExhibition);

// PUT /api/exhibitions/:id - อัปเดตข้อมูลนิทรรศการ (พร้อมอัปโหลดไฟล์)
router.put('/:id', uploadFields, handleMulterError, ExhibitionController.updateExhibition);

// DELETE /api/exhibitions/:id - ลบนิทรรศการ (soft delete)
router.delete('/:id', ExhibitionController.deleteExhibition);

// DELETE /api/exhibitions/:id/permanent - ลบนิทรรศการถาวร
router.delete('/:id/permanent', ExhibitionController.permanentDeleteExhibition);

module.exports = router; 