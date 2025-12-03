const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminAuthController = require('../controllers/adminAuthController');
const authMiddleware = require('../middleware/auth');


// 🌐 Register สำหรับผู้ใช้ทั่วไป
router.post('/register', authController.register);
router.post('/login', authController.loginUser); 

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/verify', authMiddleware, authController.verifyToken);

// 🔐 Login สำหรับแอดมินผ่าน LDAP
router.post('/admin-login', adminAuthController.adminLogin);

module.exports = router;
