-- เพิ่มคอลัมน์ position ในตาราง exhibitions
-- ใช้สำหรับเพิ่มข้อมูลตำแหน่ง/สถานที่จัดแสดง

-- เพิ่มคอลัมน์ position
ALTER TABLE exhibitions ADD COLUMN position VARCHAR(255) COMMENT 'ตำแหน่ง/สถานที่จัดแสดง' AFTER title;

-- เพิ่ม index สำหรับ position
ALTER TABLE exhibitions ADD INDEX idx_position (position);

-- อัปเดตข้อมูลตัวอย่าง (ถ้าต้องการ)
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน A' WHERE id = 1;
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน B' WHERE id = 2;
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน C' WHERE id = 3;

-- แสดงโครงสร้างตารางที่อัปเดต
DESCRIBE exhibitions;

-- แสดงข้อมูลทั้งหมด
SELECT * FROM exhibitions; 