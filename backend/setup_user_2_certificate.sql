-- Setup User ID 2 for Certificate Testing
-- User: zerryboy28@gmail.com (thodsaplon wattanasangroysri)

-- 1. Check current status
SELECT 
  r.id as registration_id,
  r.user_id,
  r.registration_type,
  r.registration_year,
  r.checked_in,
  r.check_in_time,
  u.email,
  CONCAT(u.first_name, ' ', u.last_name) as full_name
FROM registrations r
INNER JOIN users u ON r.user_id = u.id
WHERE u.id = 2;

-- 2. If no registration exists, check user
SELECT id, email, first_name, last_name 
FROM users 
WHERE id = 2;

-- 3. Set checked_in = 1 for user ID 2 (UNCOMMENT TO RUN)
UPDATE registrations 
SET checked_in = 1, 
    check_in_time = NOW() 
WHERE user_id = 2
LIMIT 1;

-- 4. Verify template is active
SELECT id, name, type, status, background_url
FROM certificate_templates
WHERE status = 'active';

-- 5. If no active template, activate template ID 22 (UNCOMMENT TO RUN)
UPDATE certificate_templates 
SET status = 'active' 
WHERE id = 22;

-- 6. Verify the setup
SELECT 
  'User' as type,
  u.id,
  u.email,
  CONCAT(u.first_name, ' ', u.last_name) as name
FROM users u
WHERE u.id = 2

UNION ALL

SELECT 
  'Registration' as type,
  r.id,
  r.registration_type,
  IF(r.checked_in = 1, 'Checked In', 'Not Checked In') as status
FROM registrations r
WHERE r.user_id = 2

UNION ALL

SELECT 
  'Template' as type,
  t.id,
  t.name,
  t.status
FROM certificate_templates t
WHERE t.status = 'active';
