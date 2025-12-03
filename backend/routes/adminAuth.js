const express = require('express');
const router = express.Router();
const { 
  adminLogin, 
  verifyAdminToken, 
  getAdminProfile, 
  adminLogout 
} = require('../controllers/adminAuthController');

// Admin Login
router.post('/admin-login', adminLogin);

// Get admin profile (ต้องมี token)
router.get('/admin-profile', verifyAdminToken, getAdminProfile);

// Admin logout
router.post('/admin-logout', verifyAdminToken, adminLogout);

module.exports = router; 