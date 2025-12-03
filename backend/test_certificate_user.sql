-- Test Certificate System for User
-- This script sets up a test user with check-in status

-- 1. Find a test user (or use existing)
SELECT id, email, first_name, last_name 
FROM users 
LIMIT 5;

-- 2. Check if user has registration
SELECT 
  r.id as registration_id,
  r.user_id,
  r.registration_type,
  r.checked_in,
  r.check_in_time,
  u.email,
  CONCAT(u.first_name, ' ', u.last_name) as full_name
FROM registrations r
INNER JOIN users u ON r.user_id = u.id
WHERE u.id = 1  -- Replace with your test user ID
LIMIT 5;

-- 3. Set checked_in = 1 for test user (UNCOMMENT TO RUN)
-- UPDATE registrations 
-- SET checked_in = 1, 
--     check_in_time = NOW() 
-- WHERE user_id = 1  -- Replace with your test user ID
-- LIMIT 1;

-- 4. Check active certificate templates
SELECT id, name, type, status, background_url
FROM certificate_templates
WHERE status = 'active'
ORDER BY created_at DESC;

-- 5. If no active template, activate one (UNCOMMENT TO RUN)
-- UPDATE certificate_templates 
-- SET status = 'active' 
-- WHERE id = 22  -- Replace with your template ID
-- LIMIT 1;

-- 6. Test the certificate API query
SELECT 
  r.id,
  r.registration_type,
  r.registration_year,
  r.checked_in,
  r.check_in_time,
  CONCAT(u.first_name, ' ', u.last_name) as full_name,
  u.email
FROM registrations r
INNER JOIN users u ON r.user_id = u.id
WHERE r.user_id = 1 AND r.checked_in = 1  -- Replace with your test user ID
ORDER BY r.check_in_time DESC;
