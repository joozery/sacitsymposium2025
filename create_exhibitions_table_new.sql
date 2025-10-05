-- สร้างตาราง exhibitions ใหม่
-- ใช้สำหรับระบบจัดการนิทรรศการ

CREATE TABLE IF NOT EXISTS exhibitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT 'ชื่อนิทรรศการ',
    title VARCHAR(500) NOT NULL COMMENT 'หัวข้อนิทรรศการ',
    position VARCHAR(255) COMMENT 'ตำแหน่ง/สถานที่จัดแสดง',
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
    INDEX idx_title (title),
    INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลนิทรรศการ';

-- เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ)
INSERT INTO exhibitions (name, title, position, description, status) VALUES
('นิทรรศการตัวอย่าง 1', 'หัวข้อนิทรรศการตัวอย่าง 1', 'ห้องแสดงผลงาน A', 'รายละเอียดนิทรรศการตัวอย่าง 1', 'active'),
('นิทรรศการตัวอย่าง 2', 'หัวข้อนิทรรศการตัวอย่าง 2', 'ห้องแสดงผลงาน B', 'รายละเอียดนิทรรศการตัวอย่าง 2', 'active'),
('นิทรรศการตัวอย่าง 3', 'หัวข้อนิทรรศการตัวอย่าง 3', 'ห้องแสดงผลงาน C', 'รายละเอียดนิทรรศการตัวอย่าง 3', 'active');

-- แสดงข้อมูลที่สร้าง
SELECT * FROM exhibitions; 