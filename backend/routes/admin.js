const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 👉 POST /api/admin/fix-registration-year - แก้ไข registration_year
router.post('/fix-registration-year', async (req, res) => {
  try {
    console.log('🔧 Starting registration year fix...');
    
    // Update all registrations to year 2025
    const [updateResult] = await db.promise().query(
      'UPDATE registrations SET registration_year = 2025 WHERE registration_year = 2025'
    );
    
    console.log(`✅ Updated ${updateResult.affectedRows} registrations`);
    
    // Get count by year
    const [countResult] = await db.promise().query(
      'SELECT registration_year, COUNT(*) as count FROM registrations GROUP BY registration_year ORDER BY registration_year'
    );
    
    res.json({
      success: true,
      message: `อัปเดต ${updateResult.affectedRows} รายการเรียบร้อย`,
      updatedRows: updateResult.affectedRows,
      yearCounts: countResult
    });
    
  } catch (error) {
    console.error('❌ Error fixing registration year:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
      error: error.message
    });
  }
});

// 👉 GET /api/admin/check-registration-year - ตรวจสอบ registration_year
router.get('/check-registration-year', async (req, res) => {
  try {
    // Get count by year
    const [countResult] = await db.promise().query(
      'SELECT registration_year, COUNT(*) as count FROM registrations GROUP BY registration_year ORDER BY registration_year'
    );
    
    // Get sample registrations
    const [sampleResult] = await db.promise().query(
      'SELECT id, user_id, registration_type, registration_year, created_at FROM registrations ORDER BY created_at DESC LIMIT 10'
    );
    
    res.json({
      success: true,
      yearCounts: countResult,
      sampleRegistrations: sampleResult
    });
    
  } catch (error) {
    console.error('❌ Error checking registration year:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล',
      error: error.message
    });
  }
});

module.exports = router; 