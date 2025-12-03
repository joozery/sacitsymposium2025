const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get attendees statistics
router.get('/stats', async (req, res) => {
  try {
    const { year } = req.query;

    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) as confirmed,
        FLOOR(COUNT(*) * 0.3) as research,
        FLOOR(COUNT(*) * 0.3) as creative,
        FLOOR(COUNT(*) * 0.4) as general
      FROM users u
      WHERE YEAR(u.created_at) = ?
    `;

    const [rows] = await db.promise().query(query, [year]);
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching attendees stats:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงสถิติได้',
      error: error.message
    });
  }
});

// Get all attendees by year and type
router.get('/', async (req, res) => {
  try {
    const { year, type, page = 1, limit = 500 } = req.query;
    const safeLimit = Math.min(Math.max(parseInt(limit) || 500, 1), 2000);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;
    let query = `
      SELECT 
        u.id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email, 
        u.phone, 
        u.organization,
        r.education_level as education,
        r.registration_date as registeredAt,
        r.registration_type as type,
        CASE 
          WHEN r.registration_date IS NOT NULL THEN 'confirmed'
          WHEN r.registration_date IS NULL AND r.id IS NOT NULL THEN 'pending'
          ELSE 'not_registered'
        END as status,
        r.objectives as projectTitle,
        r.education_level as category,
        'pending' as submissionStatus,
        r.checked_in,
        r.check_in_time,
        r.check_in_requested,
        r.check_in_request_time
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id AND (r.registration_year = ? OR r.registration_year = '225')
      WHERE 1=1
    `;
    const params = [year];

    if (type && type !== 'all') {
      query += ' AND r.registration_type = ?';
      params.push(type);
    }

    query += ' ORDER BY u.created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(safeLimit, offset);

    const [rows] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length,
      pagination: { page: safePage, limit: safeLimit }
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลผู้เข้าร่วมได้',
      error: error.message
    });
  }
});

// Get attendees by type (general, research, creative)
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { year, page = 1, limit = 500 } = req.query;

    const safeLimit = Math.min(Math.max(parseInt(limit) || 500, 1), 2000);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    if (!['general', 'research', 'creative'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'ประเภทไม่ถูกต้อง'
      });
    }

    // แสดงทุกคนพร้อมสถานะการลงทะเบียน
    const query = `
      SELECT 
        u.id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email, 
        u.phone, 
        u.organization,
        r.education_level as education,
        COALESCE(r.created_at, u.created_at) as registeredAt,
        r.registration_type as type,
        CASE 
          WHEN r.registration_date IS NOT NULL THEN 'confirmed'
          WHEN r.registration_date IS NULL AND r.id IS NOT NULL THEN 'pending'
          ELSE 'not_registered'
        END as status,
        r.objectives as projectTitle,
        r.education_level as category,
        'pending' as submissionStatus,
        CASE 
          WHEN r.checked_in = 1 THEN 'checked_in'
          WHEN r.check_in_requested = 1 THEN 'pending_approval'
          WHEN r.id IS NOT NULL THEN 'not_checked_in'
          ELSE 'not_registered'
        END as checkInStatus,
        r.checked_in,
        r.check_in_requested,
        r.check_in_time as checkInTime,
        r.check_in_request_time as checkInRequestTime
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id AND (r.registration_year = ? OR r.registration_year = '225') AND r.registration_type = ?
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.promise().query(query, [year, type, safeLimit, offset]);
    
    // Debug: Log query results
    console.log(`🔍 Fetched ${type} attendees for year ${year}:`, rows.length);
    console.log(`🔍 SQL Query used: registration_year = ${year} OR registration_year = '225'`);
    if (rows.length > 0) {
      console.log('📊 Sample attendee data:', {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        checked_in: rows[0].checked_in,
        check_in_requested: rows[0].check_in_requested,
        checkInStatus: rows[0].checkInStatus,
        registration_year: rows[0].registration_year
      });
    }
    
    // Debug: Check for pending requests in results
    const pendingInResults = rows.filter(r => r.check_in_requested === 1 && r.checked_in === 0);
    console.log(`🔍 Pending requests in results: ${pendingInResults.length}`);
    pendingInResults.forEach(req => {
      console.log(`⏳ Pending: ${req.name} (${req.email}) - Year: ${req.registration_year}`);
    });
    
    return res.json({
      success: true,
      data: rows,
      count: rows.length,
      pagination: { page: safePage, limit: safeLimit }
    });

  } catch (error) {
    console.error(`Error fetching ${req.params.type} attendees:`, error);
    res.status(500).json({
      success: false,
      message: `ไม่สามารถดึงข้อมูลผู้เข้าร่วมประเภท ${req.params.type} ได้`,
      error: error.message
    });
  }
});

// Get attendee by ID
router.get('/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        u.id, 
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email, 
        u.phone, 
        u.organization,
        r.education_level as education,
        r.registration_date as registeredAt,
        r.registration_type as type,
        CASE 
          WHEN r.registration_date IS NOT NULL THEN 'confirmed'
          ELSE 'pending'
        END as status,
        r.objectives as projectTitle,
        r.education_level as category,
        'pending' as submissionStatus,
        r.objectives,
        r.age,
        r.occupation
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id
      WHERE u.id = ?
    `;

    const [rows] = await db.promise().query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้เข้าร่วม'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching attendee:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลผู้เข้าร่วมได้',
      error: error.message
    });
  }
});

// Search attendees
router.get('/search', async (req, res) => {
  try {
    const { year, search, status, type } = req.query;
    
    let query = `
      SELECT 
        u.id, 
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email, 
        u.phone, 
        u.organization,
        r.education_level as education,
        r.registration_date as registeredAt,
        r.registration_type as type,
        CASE 
          WHEN r.registration_date IS NOT NULL THEN 'confirmed'
          ELSE 'pending'
        END as status,
        r.objectives as projectTitle,
        r.education_level as category,
        'pending' as submissionStatus
      FROM users u
      LEFT JOIN registrations r ON u.id = r.user_id
      WHERE (r.registration_year = ? OR r.registration_year = '225')
    `;
    const params = [year];

    if (search) {
      query += ` AND (CONCAT(u.first_name, ' ', u.last_name) LIKE ? OR u.email LIKE ? OR u.organization LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (status && status !== 'all') {
      if (status === 'confirmed') {
        query += ' AND r.registration_date IS NOT NULL';
      } else {
        query += ' AND r.registration_date IS NULL';
      }
    }

    if (type && type !== 'all') {
      query += ' AND r.registration_type = ?';
      params.push(type);
    }

    query += ' ORDER BY r.registration_date DESC';

    const [rows] = await db.promise().query(query, params);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error searching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถค้นหาข้อมูลได้',
      error: error.message
    });
  }
});

// Export attendees data (placeholder - would need Excel generation library)
router.get('/export', async (req, res) => {
  try {
    const { year, type } = req.query;
    
    // This is a placeholder - in a real implementation you'd use a library like 'xlsx'
    // to generate Excel files
    
    res.json({
      success: true,
      message: 'Export functionality would be implemented here',
      year,
      type
    });
  } catch (error) {
    console.error('Error exporting attendees:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถส่งออกข้อมูลได้',
      error: error.message
    });
  }
});

// 👉 PUT /api/attendees/:id/checkin - อัปเดตสถานะเช็คอิน
router.put('/:id/checkin', async (req, res) => {
  try {
    const { id } = req.params;
    const { checked_in, check_in_time, check_in_requested, check_in_request_time } = req.body;
    
    console.log('🔧 ATTENDEES CHECK-IN DEBUG:');
    console.log('User ID:', id);
    console.log('Request Body:', req.body);
    
    // First, check if the ID is a registration ID directly
    const [registrationCheck] = await db.promise().query(
      'SELECT id, user_id FROM registrations WHERE id = ?',
      [id]
    );
    
    let registrationId = null;
    let userId = null;
    
    if (registrationCheck.length > 0) {
      // ID is a registration ID
      registrationId = id;
      userId = registrationCheck[0].user_id;
      console.log('✅ ID is a registration ID:', registrationId);
    } else {
      // ID is a user ID, find the registration
      const [registrations] = await db.promise().query(
        'SELECT id FROM registrations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [id]
      );
      
      if (registrations.length === 0) {
        console.log('❌ No registration found for user ID:', id);
        return res.status(404).json({ 
          success: false, 
          message: 'ไม่พบข้อมูลการลงทะเบียนสำหรับผู้ใช้นี้' 
        });
      }
      
      registrationId = registrations[0].id;
      userId = id;
      console.log('✅ Found registration ID:', registrationId, 'for user ID:', userId);
    }
    
    const updateFields = [];
    const params = [];
    
    if (checked_in !== undefined) {
      updateFields.push('checked_in = ?');
      params.push(checked_in);
    }
    
    if (check_in_time !== undefined) {
      updateFields.push('check_in_time = ?');
      // Convert ISO datetime to MySQL format
      const mysqlDateTime = new Date(check_in_time).toISOString().slice(0, 19).replace('T', ' ');
      params.push(mysqlDateTime);
      console.log('✅ Converting check_in_time:', check_in_time, '→', mysqlDateTime);
    }
    
    if (check_in_requested !== undefined) {
      updateFields.push('check_in_requested = ?');
      params.push(check_in_requested);
    }
    
    if (check_in_request_time !== undefined) {
      updateFields.push('check_in_request_time = ?');
      // Convert ISO datetime to MySQL format
      const mysqlDateTime = new Date(check_in_request_time).toISOString().slice(0, 19).replace('T', ' ');
      params.push(mysqlDateTime);
      console.log('✅ Converting check_in_request_time:', check_in_request_time, '→', mysqlDateTime);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'ไม่มีการอัปเดตข้อมูล' 
      });
    }
    
    params.push(registrationId);
    
    const query = `
      UPDATE registrations 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    console.log('🔧 UPDATE Query:', query);
    console.log('🔧 UPDATE Params:', params);
    
    const [result] = await db.promise().query(query, params);
    
    console.log('🔧 UPDATE Result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลการลงทะเบียน' 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'อัปเดตสถานะเช็คอินสำเร็จ'
    });
    
  } catch (err) {
    console.error('❌ Update check-in status error:', err);
    console.error('❌ Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะเช็คอิน: ' + err.message
    });
  }
});

module.exports = router; 