const express = require('express');
const multer = require('multer');
const WorksController = require('../controllers/worksController');

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
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

// API Routes

// GET /api/works - ดึงรายการผลงานสร้างสรรค์ทั้งหมด
router.get('/', WorksController.getAllWorks);

// GET /api/works/:id - ดึงข้อมูลผลงานสร้างสรรค์ตาม ID
router.get('/:id', WorksController.getWorkById);

// POST /api/works - เพิ่มผลงานสร้างสรรค์ใหม่ (พร้อมอัปโหลดไฟล์)
router.post('/', uploadFields, handleMulterError, WorksController.createWork);

// PUT /api/works/:id - อัปเดตข้อมูลผลงานสร้างสรรค์ (พร้อมอัปโหลดไฟล์)
router.put('/:id', uploadFields, handleMulterError, WorksController.updateWork);

// DELETE /api/works/:id - ลบผลงานสร้างสรรค์ (soft delete)
router.delete('/:id', WorksController.deleteWork);

// DELETE /api/works/:id/permanent - ลบผลงานสร้างสรรค์ถาวร (hard delete)
router.delete('/:id/permanent', WorksController.permanentDeleteWork);

module.exports = router; 