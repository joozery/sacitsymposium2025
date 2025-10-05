-- อัปเดตตาราง exhibitions ที่มีอยู่แล้ว
-- เพิ่มข้อมูลตำแหน่งให้กับนิทรรศการที่มีอยู่

-- เพิ่มคอลัมน์ position (ถ้ายังไม่มี)
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS position VARCHAR(255) COMMENT 'ตำแหน่ง/สถานที่จัดแสดง' AFTER title;

-- เพิ่ม index สำหรับ position (ถ้ายังไม่มี)
ALTER TABLE exhibitions ADD INDEX IF NOT EXISTS idx_position (position);

-- อัปเดตข้อมูลตัวอย่างที่มีอยู่แล้ว
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน A' WHERE id = 1;
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน B' WHERE id = 2;
UPDATE exhibitions SET position = 'ห้องแสดงผลงาน C' WHERE id = 3;

-- แสดงโครงสร้างตารางที่อัปเดต
DESCRIBE exhibitions;

-- แสดงข้อมูลทั้งหมด
SELECT * FROM exhibitions; 