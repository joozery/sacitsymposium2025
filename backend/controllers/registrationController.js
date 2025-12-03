const db = require('../db/db');
const bcrypt = require('bcrypt');

exports.registerUserAndCreateRegistration = async (req, res) => {
  let connection;
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      organization,
      registration_type,
      title_prefix,
      education_level,
      registration_year,
      terms_accepted,
      age,
      occupation,
      objectives,
      privacy_consent,
      registration_date
    } = req.body;

    // ✅ ตรวจสอบ required fields
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'กรุณากรอกอีเมล' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'กรุณากรอกรหัสผ่าน' });
    }

    console.log('📥 password received:', password);
    console.log('📧 email received:', email);

    // ✅ ตรวจว่า user มีอยู่แล้วหรือไม่
    const [userExist] = await db.promise().query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    if (userExist.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'อีเมลนี้ถูกใช้แล้ว' });
    }

    // ✅ เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ บันทึก users โดยใช้ password_hash
    const [userResult] = await db.promise().query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, organization, role)
      VALUES (?, ?, ?, ?, ?, ?, 'user')
    `,
      [email, hashedPassword, first_name, last_name, phone, organization]
    );

    const user_id = userResult.insertId;

    // ✅ ตรวจและแปลง objectives ให้เป็น array เสมอ
    const formattedObjectives = Array.isArray(objectives) ? objectives : [objectives];

    // ✅ บันทึกข้อมูล registration
    await db.promise().query(
      `
      INSERT INTO registrations 
      (user_id, registration_type, title_prefix, education_level, registration_year, terms_accepted, age, occupation, objectives, privacy_consent, registration_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        user_id,
        registration_type,
        title_prefix,
        education_level,
        registration_year,
        terms_accepted ? 1 : 0,
        age,
        occupation,
        JSON.stringify(formattedObjectives),
        privacy_consent,
        registration_date
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกและลงทะเบียนเรียบร้อยแล้ว',
      data: { user_id }
    });

  } catch (err) {
    console.error('Register error:', err);
    console.error('Request body:', req.body);
    
    // Handle specific database connection errors
    if (err.message && err.message.includes('connection is in closed state')) {
      return res
        .status(503)
        .json({ success: false, message: 'บริการฐานข้อมูลไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง' });
    }
    
    // Handle SQL syntax errors
    if (err.code === 'ER_PARSE_ERROR') {
      console.error('SQL Parse Error Details:', {
        sql: err.sql,
        sqlMessage: err.sqlMessage,
        sqlState: err.sqlState
      });
      return res
        .status(500)
        .json({ success: false, message: 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล กรุณาตรวจสอบข้อมูลที่ส่งมา' });
    }
    
    return res
      .status(500)
      .json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

// ดึงรายชื่อผู้ลงทะเบียนตามปีและประเภท
exports.getRegistrations = async (req, res) => {
  try {
    const { year, type, status } = req.query;
    
    let query = `
      SELECT 
        r.id,
        r.registration_type,
        r.title_prefix,
        r.education_level,
        r.registration_year,
        r.terms_accepted,
        r.age,
        r.occupation,
        r.objectives,
        r.privacy_consent,
        r.registration_date,
        r.created_at,
        r.checked_in,
        r.check_in_time,
        r.check_in_requested,
        r.check_in_request_time,
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.organization
      FROM registrations r
      INNER JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (year) {
      query += ` AND (r.registration_year = ? OR r.registration_year = '225')`;
      params.push(year);
    }
    
    if (type) {
      query += ` AND r.registration_type = ?`;
      params.push(type);
    }
    
    if (status) {
      query += ` AND r.status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY r.created_at DESC`;
    
    console.log('📊 REGISTRATION QUERY DEBUG:');
    console.log('Query:', query);
    console.log('Params:', params);
    
    // Debug: Count total registrations first
    const [totalCount] = await db.promise().query(
      'SELECT COUNT(*) as total FROM registrations WHERE (registration_year = ? OR registration_year = "225")', 
      [year]
    );
    console.log('📈 Total registrations in year:', totalCount[0]?.total);
    
    // Debug: Count by type
    const [typeCount] = await db.promise().query(
      'SELECT COUNT(*) as total FROM registrations WHERE (registration_year = ? OR registration_year = "225") AND registration_type = ?', 
      [year, type]
    );
    console.log('📊 Registrations by type:', typeCount[0]?.total);
    
    // Debug: Count with JOIN
    const [joinCount] = await db.promise().query(
      'SELECT COUNT(*) as total FROM registrations r INNER JOIN users u ON r.user_id = u.id WHERE (r.registration_year = ? OR r.registration_year = "225") AND r.registration_type = ?', 
      [year, type]
    );
    console.log('🔗 Registrations after JOIN:', joinCount[0]?.total);
    
    const [registrations] = await db.promise().query(query, params);
    
    console.log('✅ Final result count:', registrations.length);
    
    // Transform data to match frontend expectations
    const transformedData = registrations.map(reg => ({
      id: reg.id,
      title_prefix: reg.title_prefix,
      first_name: reg.first_name,
      last_name: reg.last_name,
      email: reg.email,
      phone: reg.phone,
      organization: reg.organization,
      education_level: reg.education_level,
      created_at: reg.created_at,
      status: reg.status || 'confirmed', // Default to confirmed if no status field
      checked_in: reg.checked_in || false,
      check_in_time: reg.check_in_time,
      check_in_requested: reg.check_in_requested || false,
      check_in_request_time: reg.check_in_request_time,
      registration_type: reg.registration_type,
      registration_year: reg.registration_year
    }));
    
    return res.status(200).json({
      success: true,
      data: transformedData,
      count: transformedData.length
    });
    
  } catch (err) {
    console.error('Get registrations error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน' 
    });
  }
};

// อัปเดตสถานะเช็คอิน
exports.updateCheckInStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { checked_in, check_in_time, check_in_requested, check_in_request_time } = req.body;
    
    console.log('🔧 UPDATE CHECK-IN STATUS DEBUG:');
    console.log('Registration ID:', id);
    console.log('Request Body:', req.body);
    console.log('Parsed fields:', {
      checked_in,
      check_in_time,
      check_in_requested,
      check_in_request_time
    });
    
    const updateFields = [];
    const params = [];
    
    if (checked_in !== undefined) {
      updateFields.push('checked_in = ?');
      params.push(checked_in);
      console.log('✅ Adding checked_in field');
    }
    
    if (check_in_time !== undefined) {
      updateFields.push('check_in_time = ?');
      // Convert ISO datetime to MySQL format
      const mysqlDateTime = new Date(check_in_time).toISOString().slice(0, 19).replace('T', ' ');
      params.push(mysqlDateTime);
      console.log('✅ Adding check_in_time field:', mysqlDateTime);
    } else if (checked_in === true) {
      // Auto-set check_in_time when approving check-in
      updateFields.push('check_in_time = NOW()');
      console.log('✅ Auto-setting check_in_time');
    }
    
    if (check_in_requested !== undefined) {
      updateFields.push('check_in_requested = ?');
      params.push(check_in_requested);
      console.log('✅ Adding check_in_requested field');
    } else if (checked_in === true) {
      // Auto-set check_in_requested to false when approving check-in
      updateFields.push('check_in_requested = false');
      console.log('✅ Auto-setting check_in_requested to false');
    }
    
    if (check_in_request_time !== undefined) {
      updateFields.push('check_in_request_time = ?');
      // Convert ISO datetime to MySQL format
      const mysqlDateTime = new Date(check_in_request_time).toISOString().slice(0, 19).replace('T', ' ');
      params.push(mysqlDateTime);
      console.log('✅ Adding check_in_request_time field:', mysqlDateTime);
    }
    
    if (updateFields.length === 0) {
      console.log('❌ No fields to update');
      return res.status(400).json({ 
        success: false, 
        message: 'ไม่มีการอัปเดตข้อมูล' 
      });
    }
    
    params.push(id);
    
    const query = `
      UPDATE registrations 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    console.log('📝 SQL Query:', query);
    console.log('📝 SQL Params:', params);
    
    const [result] = await db.promise().query(query, params);
    
    console.log('📊 Query Result:', result);
    console.log('📊 Affected Rows:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      console.log('❌ No rows affected - registration not found');
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลการลงทะเบียน' 
      });
    }
    
    console.log('✅ Update successful');
    return res.status(200).json({
      success: true,
      message: 'อัปเดตสถานะเช็คอินสำเร็จ'
    });
    
  } catch (err) {
    console.error('❌ Update check-in status error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะเช็คอิน' 
    });
  }
};

// ยกเลิกการเช็คอิน
exports.cancelCheckIn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE registrations 
      SET checked_in = false, check_in_time = NULL, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await db.promise().query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลการลงทะเบียน' 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'ยกเลิกการเช็คอินสำเร็จ'
    });
    
  } catch (err) {
    console.error('Cancel check-in error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการยกเลิกการเช็คอิน' 
    });
  }
};
