const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Create symposium_en_content table
router.post('/symposium-en', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS symposium_en_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        header_title TEXT,
        header_subtitle TEXT,
        header_venue TEXT,
        header_date VARCHAR(255),
        about_title VARCHAR(255),
        about_description TEXT,
        objectives_title VARCHAR(255),
        objectives_list JSON,
        target_audience_title VARCHAR(255),
        target_audience_description TEXT,
        registration_title VARCHAR(255),
        registration_description TEXT,
        registration_button_text VARCHAR(255),
        registration_button_link VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await db.execute(createTableQuery);

    res.json({
      success: true,
      message: 'symposium_en_content table created successfully'
    });
  } catch (error) {
    console.error('Error creating symposium_en_content table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
});

// Create symposium_th_content table
router.post('/symposium-th', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS symposium_th_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        header_title TEXT,
        header_subtitle TEXT,
        header_venue TEXT,
        header_date VARCHAR(255),
        about_title VARCHAR(255),
        about_description TEXT,
        objectives_title VARCHAR(255),
        objectives_list JSON,
        target_audience_title VARCHAR(255),
        target_audience_description TEXT,
        registration_title VARCHAR(255),
        registration_description TEXT,
        registration_button_text VARCHAR(255),
        registration_button_link VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await db.execute(createTableQuery);

    res.json({
      success: true,
      message: 'symposium_th_content table created successfully'
    });
  } catch (error) {
    console.error('Error creating symposium_th_content table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
});

// Create certificate_templates table
router.post('/certificate-templates', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS certificate_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('participation', 'achievement', 'completion', 'appreciation') DEFAULT 'participation',
        event_date DATE,
        status ENUM('draft', 'published') DEFAULT 'draft',
        qr_link VARCHAR(500),
        background_url VARCHAR(500),
        background_key VARCHAR(255),
        width INT DEFAULT 800,
        height INT DEFAULT 600,
        background_color VARCHAR(50) DEFAULT '#FFFFFF',
        elements JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_type (type)
      )
    `;

    await db.execute(createTableQuery);

    res.json({
      success: true,
      message: 'certificate_templates table created successfully'
    });
  } catch (error) {
    console.error('Error creating certificate_templates table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
});

// Create work_categories table
router.post('/work-categories', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS work_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description TEXT,
        icon VARCHAR(100),
        color VARCHAR(50),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_order (display_order)
      )
    `;

    await db.execute(createTableQuery);

    res.json({
      success: true,
      message: 'work_categories table created successfully'
    });
  } catch (error) {
    console.error('Error creating work_categories table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create table',
      error: error.message
    });
  }
});

// Add indexes for attendees optimization
router.post('/attendees-indexes', async (req, res) => {
  try {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_registrations_year_type ON registrations(registration_year, registration_type)',
      'CREATE INDEX IF NOT EXISTS idx_registrations_user_year ON registrations(user_id, registration_year)',
      'CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at)'
    ];

    for (const indexQuery of indexes) {
      try {
        await db.execute(indexQuery);
      } catch (err) {
        // Ignore if index already exists
        if (!err.message.includes('Duplicate key name')) {
          throw err;
        }
      }
    }

    res.json({
      success: true,
      message: 'Attendees indexes created successfully'
    });
  } catch (error) {
    console.error('Error creating attendees indexes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create indexes',
      error: error.message
    });
  }
});

// Add indexes for check-in optimization
router.post('/checkin-indexes', async (req, res) => {
  try {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_registrations_user_created ON registrations(user_id, created_at)',
      'CREATE INDEX IF NOT EXISTS idx_registrations_checkin ON registrations(checked_in)'
    ];

    for (const indexQuery of indexes) {
      try {
        await db.execute(indexQuery);
      } catch (err) {
        if (!err.message.includes('Duplicate key name')) {
          throw err;
        }
      }
    }

    res.json({
      success: true,
      message: 'Check-in indexes created successfully'
    });
  } catch (error) {
    console.error('Error creating check-in indexes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create indexes',
      error: error.message
    });
  }
});

// Add index for user login optimization
router.post('/user-indexes', async (req, res) => {
  try {
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

    res.json({
      success: true,
      message: 'User indexes created successfully'
    });
  } catch (error) {
    console.error('Error creating user indexes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create indexes',
      error: error.message
    });
  }
});

// Add description column to certificate_templates
router.post('/certificate-templates-description-column', async (req, res) => {
  try {
    await db.execute(`
      ALTER TABLE certificate_templates 
      ADD COLUMN IF NOT EXISTS description TEXT AFTER name
    `);

    res.json({
      success: true,
      message: 'Description column added successfully'
    });
  } catch (error) {
    console.error('Error adding description column:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add column',
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Setup routes are working'
  });
});

module.exports = router;

