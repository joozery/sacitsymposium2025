const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// 👉 POST /api/registrations
router.post('/', registrationController.registerUserAndCreateRegistration);

// 👉 GET /api/registrations - ดึงรายชื่อผู้ลงทะเบียน
router.get('/', registrationController.getRegistrations);

// 👉 PUT /api/registrations/:id/checkin - อัปเดตสถานะเช็คอิน
router.put('/:id/checkin', registrationController.updateCheckInStatus);

// 👉 PUT /api/registrations/:id/checkin/cancel - ยกเลิกการเช็คอิน
router.put('/:id/checkin/cancel', registrationController.cancelCheckIn);

module.exports = router;
