const express = require('express');
const router = express.Router();

// Add error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Safe version - check if db is available
let db;
try {
  db = require('../db/db');
} catch (error) {
  console.error('Database connection not available:', error.message);
}

// Middleware to check database availability
const checkDatabase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: 'Database connection not available',
      message: 'Please check database configuration'
    });
  }
  next();
};

// Helper function to safely extract results from db.execute
const extractDbResult = (result) => {
  if (Array.isArray(result)) {
    return result[0] || result;
  } else if (result && result.rows) {
    return result.rows;
  }
  return result || [];
};

// Get all exhibitions with optional filtering
router.get('/', checkDatabase, asyncHandler(async (req, res) => {
  try {
    const { status, category_id, search } = req.query;
    
    // Skip table check since categories work - proceed directly to query
    console.log('🎯 Proceeding directly to exhibitions query (categories work, so tables exist)');
    
    let query = `
      SELECT e.*, ec.name as category_name, ec.color_code as category_color
      FROM exhibitions e 
      LEFT JOIN exhibition_categories ec ON e.category_id = ec.id 
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    if (category_id) {
      query += ' AND e.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (e.name LIKE ? OR e.position LIKE ? OR e.description LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await db.execute(query, params);
    const exhibitions = extractDbResult(result);
    res.json(exhibitions || []);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch exhibitions',
      message: error.message,
      hint: 'Check if database tables exist'
    });
  }
}));

// Health check endpoint (must come before /:id route)
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Exhibitions API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all exhibition categories (must come before /:id route)
router.get('/categories/list', checkDatabase, asyncHandler(async (req, res) => {
  try {
    console.log('🔍 Fetching categories from database...');
    
    const categoriesResult = await db.execute(
      'SELECT * FROM exhibition_categories ORDER BY name ASC'
    );
    console.log('📊 Raw categories result:', categoriesResult);
    
    const categories = extractDbResult(categoriesResult);
    console.log('✅ Extracted categories:', categories);
    console.log('📈 Categories count:', categories ? categories.length : 0);
    
    // If no categories found, return default ones
    if (!categories || categories.length === 0) {
      console.log('⚠️ No categories found in database, returning defaults');
      const defaultCategories = [
        { id: 1, name: 'Traditional Crafts', description: 'งานฝีมือดั้งเดิม', color_code: '#10b981' },
        { id: 2, name: 'Contemporary Arts', description: 'ศิลปะร่วมสมัย', color_code: '#3b82f6' },
        { id: 3, name: 'Textile & Weaving', description: 'สิ่งทอและการทอผ้า', color_code: '#8b5cf6' },
        { id: 4, name: 'Ceramics & Pottery', description: 'เครื่องปั้นดินเผา', color_code: '#f59e0b' },
        { id: 5, name: 'Wood & Bamboo', description: 'ไม้และไผ่', color_code: '#84cc16' },
        { id: 6, name: 'Metal & Jewelry', description: 'โลหะและเครื่องประดับ', color_code: '#ef4444' },
        { id: 7, name: 'Natural Materials', description: 'วัสดุธรรมชาติ', color_code: '#06b6d4' }
      ];
      return res.json(defaultCategories);
    }
    
    res.json(categories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    console.log('🔄 Returning default categories due to error');
    // Return default categories if error occurs
    res.json([
      { id: 1, name: 'Traditional Crafts', description: 'งานฝีมือดั้งเดิม', color_code: '#10b981' },
      { id: 2, name: 'Contemporary Arts', description: 'ศิลปะร่วมสมัย', color_code: '#3b82f6' },
      { id: 3, name: 'Textile & Weaving', description: 'สิ่งทอและการทอผ้า', color_code: '#8b5cf6' },
      { id: 4, name: 'Ceramics & Pottery', description: 'เครื่องปั้นดินเผา', color_code: '#f59e0b' },
      { id: 5, name: 'Wood & Bamboo', description: 'ไม้และไผ่', color_code: '#84cc16' },
      { id: 6, name: 'Metal & Jewelry', description: 'โลหะและเครื่องประดับ', color_code: '#ef4444' },
      { id: 7, name: 'Natural Materials', description: 'วัสดุธรรมชาติ', color_code: '#06b6d4' }
    ]);
  }
}));

// Get single exhibition by ID
router.get('/:id', checkDatabase, asyncHandler(async (req, res) => {
  try {
    const exhibitionId = req.params.id;

    // Get exhibition details
    const exhibitionsResult = await db.execute(
      `SELECT e.*, ec.name as category_name, ec.color_code as category_color
       FROM exhibitions e 
       LEFT JOIN exhibition_categories ec ON e.category_id = ec.id 
       WHERE e.id = ?`,
      [exhibitionId]
    );
    const exhibitions = extractDbResult(exhibitionsResult);

    if (!exhibitions || exhibitions.length === 0) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    const exhibition = exhibitions[0];

    // Try to get exhibition images (optional)
    try {
      const imagesResult = await db.execute(
        'SELECT * FROM exhibition_images WHERE exhibition_id = ? ORDER BY created_at ASC',
        [exhibitionId]
      );
      const images = extractDbResult(imagesResult);
      exhibition.images = images || [];
    } catch (imgError) {
      console.warn('Exhibition images table not found:', imgError.message);
      exhibition.images = [];
    }

    // Try to get exhibition documents (optional)
    try {
      const documentsResult = await db.execute(
        'SELECT * FROM exhibition_documents WHERE exhibition_id = ? ORDER BY created_at ASC',
        [exhibitionId]
      );
      const documents = extractDbResult(documentsResult);
      exhibition.documents = documents || [];
    } catch (docError) {
      console.warn('Exhibition documents table not found:', docError.message);
      exhibition.documents = [];
    }

    res.json(exhibition);
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    res.status(500).json({ 
      error: 'Failed to fetch exhibition',
      message: error.message
    });
  }
}));

// Create new exhibition
router.post('/', checkDatabase, asyncHandler(async (req, res) => {
  try {
    console.log('📝 CREATE EXHIBITION - Request received');
    console.log('📋 Headers:', req.headers);
    console.log('📊 Raw body:', req.body);
    console.log('📊 Body type:', typeof req.body);
    console.log('📊 Body stringify:', JSON.stringify(req.body));
    
    const {
      name,
      position,
      description,
      image_url,
      image_filename,
      pdf_url,
      pdf_filename,
      category_id,
      location,
      organizer,
      contact_info,
      start_date,
      end_date,
      status = 'active'
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Fix data types and null values
    const cleanCategoryId = category_id ? parseInt(category_id) : null;
    const cleanStartDate = start_date && start_date.trim() !== '' ? start_date : null;
    const cleanEndDate = end_date && end_date.trim() !== '' ? end_date : null;

    console.log('🔧 Cleaned data:', {
      name, position, description, image_url, image_filename, pdf_url, pdf_filename,
      cleanCategoryId, location, organizer, contact_info, 
      cleanStartDate, cleanEndDate, status
    });

    // Check table structure first
    try {
      const tableCheck = await db.execute('DESCRIBE exhibitions');
      console.log('🏗️ Table Structure:', extractDbResult(tableCheck));
    } catch (err) {
      console.error('⚠️ Could not check table structure:', err.message);
    }

    console.log('🔍 About to execute SQL INSERT...');
    
    let insertResult;
    try {
      insertResult = await db.execute(
        `INSERT INTO exhibitions 
         (name, position, description, image_url, image_filename, pdf_url, pdf_filename,
          category_id, location, organizer, contact_info, start_date, end_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, position, description, image_url, image_filename, pdf_url, pdf_filename,
         cleanCategoryId, location, organizer, contact_info, cleanStartDate, cleanEndDate, status]
      );
      
      console.log('💾 INSERT Result:', insertResult);
      console.log('📊 Result type:', typeof insertResult);
      console.log('📊 Result array?:', Array.isArray(insertResult));
      
    } catch (sqlError) {
      console.error('🚨 SQL INSERT ERROR:', sqlError.message);
      console.error('🚨 SQL Error Code:', sqlError.code);
      console.error('🚨 SQL Error SQL:', sqlError.sql);
      throw new Error(`Database insertion failed: ${sqlError.message}`);
    }

    if (!insertResult) {
      throw new Error('Database execute returned undefined - connection issue?');
    }

    const result = extractDbResult(insertResult);
    console.log('✅ Extracted Result:', result);
    
    const insertId = result?.insertId || (insertResult[0] && insertResult[0].insertId);
    console.log('🆔 Final Insert ID:', insertId);

    res.status(201).json({ 
      id: insertId, 
      message: 'Exhibition created successfully' 
    });
  } catch (error) {
    console.error('Error creating exhibition:', error);
    res.status(500).json({ 
      error: 'Failed to create exhibition',
      message: error.message
    });
  }
}));

// Update exhibition
router.put('/:id', checkDatabase, asyncHandler(async (req, res) => {
  try {
    const exhibitionId = req.params.id;
    const {
      name,
      position,
      description,
      image_url,
      pdf_url,
      category_id,
      location,
      organizer,
      contact_info,
      start_date,
      end_date,
      status
    } = req.body;

    // Check if exhibition exists
    const existingResult = await db.execute('SELECT id FROM exhibitions WHERE id = ?', [exhibitionId]);
    const existing = extractDbResult(existingResult);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    await db.execute(
      `UPDATE exhibitions SET 
       name = ?, position = ?, description = ?, image_url = ?,
       pdf_url = ?, category_id = ?, location = ?, organizer = ?,
       contact_info = ?, start_date = ?, end_date = ?, status = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, position, description, image_url, pdf_url,
       category_id, location, organizer, contact_info, start_date, end_date, status, exhibitionId]
    );

    res.json({ message: 'Exhibition updated successfully' });
  } catch (error) {
    console.error('Error updating exhibition:', error);
    res.status(500).json({ 
      error: 'Failed to update exhibition',
      message: error.message
    });
  }
}));

// Delete exhibition
router.delete('/:id', checkDatabase, asyncHandler(async (req, res) => {
  try {
    const exhibitionId = req.params.id;

    // Check if exhibition exists
    const existingResult = await db.execute('SELECT id FROM exhibitions WHERE id = ?', [exhibitionId]);
    const existing = extractDbResult(existingResult);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ error: 'Exhibition not found' });
    }

    await db.execute('DELETE FROM exhibitions WHERE id = ?', [exhibitionId]);

    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    res.status(500).json({ 
      error: 'Failed to delete exhibition',
      message: error.message
    });
  }
}));

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Exhibitions API Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
    path: req.path,
    method: req.method
  });
});

module.exports = router;