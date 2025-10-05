const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sacit_db',
  charset: 'utf8mb4'
};

// SQL สำหรับสร้างตาราง
const createTableSQL = `
CREATE TABLE IF NOT EXISTS exhibitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'ชื่อนิทรรศการ',
    title VARCHAR(500) NOT NULL COMMENT 'หัวข้อนิทรรศการ',
    description TEXT COMMENT 'รายละเอียดนิทรรศการ',
    image_url VARCHAR(500) COMMENT 'URL รูปภาพหน้าปก',
    pdf_url VARCHAR(500) COMMENT 'URL ไฟล์ PDF',
    pdf_filename VARCHAR(255) COMMENT 'ชื่อไฟล์ PDF',
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active' COMMENT 'สถานะ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่แก้ไขล่าสุด',
    
    -- Indexes สำหรับการค้นหา
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_name (name),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลนิทรรศการ';
`;

// ข้อมูลตัวอย่าง
const sampleData = [
  {
    name: 'นิทรรศการตัวอย่าง 1',
    title: 'หัวข้อนิทรรศการตัวอย่าง 1',
    description: 'รายละเอียดนิทรรศการตัวอย่าง 1 - นี่เป็นข้อมูลตัวอย่างสำหรับทดสอบระบบ',
    status: 'active'
  },
  {
    name: 'นิทรรศการตัวอย่าง 2',
    title: 'หัวข้อนิทรรศการตัวอย่าง 2',
    description: 'รายละเอียดนิทรรศการตัวอย่าง 2 - นี่เป็นข้อมูลตัวอย่างสำหรับทดสอบระบบ',
    status: 'active'
  },
  {
    name: 'นิทรรศการตัวอย่าง 3',
    title: 'หัวข้อนิทรรศการตัวอย่าง 3',
    description: 'รายละเอียดนิทรรศการตัวอย่าง 3 - นี่เป็นข้อมูลตัวอย่างสำหรับทดสอบระบบ',
    status: 'active'
  }
];

async function setupExhibitionsTable() {
  let connection;
  
  try {
    console.log('🔗 เชื่อมต่อฐานข้อมูล...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');

    // สร้างตาราง
    console.log('📋 สร้างตาราง exhibitions...');
    await connection.execute(createTableSQL);
    console.log('✅ สร้างตารางสำเร็จ');

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const [existingRows] = await connection.execute('SELECT COUNT(*) as count FROM exhibitions');
    const count = existingRows[0].count;

    if (count === 0) {
      console.log('📝 เพิ่มข้อมูลตัวอย่าง...');
      
      for (const data of sampleData) {
        await connection.execute(
          'INSERT INTO exhibitions (name, title, description, status) VALUES (?, ?, ?, ?)',
          [data.name, data.title, data.description, data.status]
        );
        console.log(`✅ เพิ่มข้อมูล: ${data.name}`);
      }
      
      console.log('✅ เพิ่มข้อมูลตัวอย่างสำเร็จ');
    } else {
      console.log(`ℹ️ มีข้อมูลอยู่แล้ว ${count} รายการ`);
    }

    // แสดงข้อมูลทั้งหมด
    console.log('📊 แสดงข้อมูลทั้งหมด:');
    const [rows] = await connection.execute('SELECT * FROM exhibitions ORDER BY created_at DESC');
    
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name} - ${row.title} (${row.status})`);
    });

    console.log('🎉 การตั้งค่าตาราง exhibitions เสร็จสิ้น!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    console.error('รายละเอียด:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 ปิดการเชื่อมต่อฐานข้อมูล');
    }
  }
}

// เรียกใช้ฟังก์ชัน
if (require.main === module) {
  setupExhibitionsTable();
}

module.exports = { setupExhibitionsTable }; 