const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ REGISTER
exports.register = async (req, res) => {
  const { email, password, first_name, last_name, phone, organization, role, profile_image } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, organization, role, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().query(sql, [email, hashedPassword, first_name, last_name, phone, organization, role, profile_image]);
    
    return res.status(201).json({ success: true, message: 'User created', userId: result.insertId });
    
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle specific database connection errors
    if (error.message && error.message.includes('connection is in closed state')) {
      return res.status(503).json({ success: false, message: 'บริการฐานข้อมูลไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง' });
    }
    
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
};

// ✅ LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('🔐 Login attempt:', email);
    
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    console.log('👤 User found:', rows.length > 0);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }

    const user = rows[0];
    console.log('🔑 Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('✅ Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    delete user.password_hash;

    console.log('✅ Login successful for:', email);
    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        token,
        user
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Handle specific database connection errors
    if (error.message && error.message.includes('connection is in closed state')) {
      return res.status(503).json({ success: false, message: 'บริการฐานข้อมูลไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง' });
    }
    
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
  }
};

// ✅ GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const [rows] = await db.promise().query(`
      SELECT id, email, first_name, last_name, phone, organization, role, profile_image 
      FROM users WHERE id = ?
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้' });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const userId = req.user?.id;
  const { first_name, last_name, phone, organization, profile_image } = req.body;

  try {
    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, organization = ?, profile_image = ?
      WHERE id = ?
    `;

    await db.promise().query(sql, [first_name, last_name, phone, organization, profile_image, userId]);

    const [updatedUser] = await db.promise().query(`
      SELECT id, email, first_name, last_name, phone, organization, role, profile_image 
      FROM users WHERE id = ?
    `, [userId]);

    res.json({ success: true, data: { user: updatedUser[0] } });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถอัปเดตโปรไฟล์ได้' });
  }
};

// ✅ CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const [rows] = await db.promise().query(`SELECT password_hash FROM users WHERE id = ?`, [userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' });

    const newHashed = await bcrypt.hash(newPassword, 10);
    await db.promise().query(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHashed, userId]);

    res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'ไม่สามารถเปลี่ยนรหัสผ่านได้' });
  }
};

// ✅ VERIFY TOKEN
exports.verifyToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    res.json({ success: true, message: 'Token ใช้งานได้', userId });
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(401).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};
