const ldap = require('ldapauth-fork');
const jwt = require('jsonwebtoken');

// LDAP Configuration
const ldapConfig = {
  url: 'ldap://172.16.0.2:389',
  bindDN: 'administrator',
  bindCredentials: 'ITS@pp0rt',
  searchBase: 'DC=yourdomain,DC=com', // ปรับตาม domain ของคุณ
  searchFilter: '(sAMAccountName={{username}})',
  searchAttributes: ['displayName', 'mail', 'memberOf'],
  reconnect: true,
  timeout: 5000,
  connectTimeout: 10000,
  idleTimeout: 10000,
};

// Create LDAP client
const createLdapClient = () => {
  return new ldap(ldapConfig);
};

// Admin Login with LDAP
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    });
  }

  const ldapClient = createLdapClient();

  ldapClient.authenticate(username, password, async (err, user) => {
    if (err) {
      console.error('LDAP Authentication Error:', err);
      
      // ปิดการเชื่อมต่อ LDAP
      ldapClient.close();
      
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    try {
      // ตรวจสอบว่าเป็น admin หรือไม่
      const isAdmin = await checkAdminRole(user);
      
      if (!isAdmin) {
        ldapClient.close();
        return res.status(403).json({
          success: false,
          message: 'คุณไม่มีสิทธิ์เข้าถึงระบบจัดการ'
        });
      }

      // สร้าง JWT token
      const token = jwt.sign(
        {
          userId: user.uid || user.sAMAccountName,
          username: user.sAMAccountName,
          displayName: user.displayName,
          email: user.mail,
          role: 'admin',
          ldapGroups: user.memberOf
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // ส่งข้อมูลกลับ
      res.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          id: user.uid || user.sAMAccountName,
          username: user.sAMAccountName,
          displayName: user.displayName,
          email: user.mail,
          role: 'admin'
        }
      });

    } catch (error) {
      console.error('Token generation error:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการสร้าง token'
      });
    } finally {
      // ปิดการเชื่อมต่อ LDAP
      ldapClient.close();
    }
  });
};

// ตรวจสอบสิทธิ์ admin
const checkAdminRole = async (user) => {
  try {
    // ตรวจสอบจาก memberOf หรือ group membership
    if (user.memberOf) {
      const groups = Array.isArray(user.memberOf) ? user.memberOf : [user.memberOf];
      
      // ตรวจสอบว่าอยู่ในกลุ่ม admin หรือไม่
      const adminGroups = [
        'CN=Domain Admins,CN=Users,DC=yourdomain,DC=com',
        'CN=Administrators,CN=Builtin,DC=yourdomain,DC=com',
        // เพิ่มกลุ่ม admin อื่นๆ ตามต้องการ
      ];

      return adminGroups.some(group => 
        groups.some(userGroup => 
          userGroup.toLowerCase().includes(group.toLowerCase())
        )
      );
    }

    // ถ้าไม่มี memberOf ให้ตรวจสอบจาก username
    const adminUsernames = ['administrator', 'admin'];
    return adminUsernames.includes(user.sAMAccountName?.toLowerCase());

  } catch (error) {
    console.error('Admin role check error:', error);
    return false;
  }
};

// ตรวจสอบ token
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบ token การเข้าสู่ระบบ'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง'
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token ไม่ถูกต้องหรือหมดอายุ'
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์'
    });
  }
};

// Admin logout
const adminLogout = async (req, res) => {
  try {
    // ในระบบจริงอาจจะต้อง blacklist token
    res.json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    });
  }
};

module.exports = {
  adminLogin,
  verifyAdminToken,
  getAdminProfile,
  adminLogout
};
