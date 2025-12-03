const express = require('express');
const router = express.Router();
const multer = require('multer');

// Database connection
const db = require('../db/db');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// GET /api/certificates/templates - Get all certificate templates
router.get('/templates', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    let query = 'SELECT id, name, type, event_date, status, qr_link, background_url, background_key, width, height, background_color, created_at, updated_at, elements FROM certificate_templates';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);
    
    // Convert dates to strings and ensure elements is properly handled
    const templates = rows.map(template => ({
      ...template,
      event_date: template.event_date ? template.event_date.toISOString().split('T')[0] : null,
      created_at: template.created_at ? template.created_at.toISOString() : null,
      updated_at: template.updated_at ? template.updated_at.toISOString() : null,
      elements: template.elements || []
    }));

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    console.error('Error fetching certificate templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate templates',
      error: error.message
    });
  }
});

// GET /api/certificates/templates/:id - Get specific certificate template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.execute(
      'SELECT * FROM certificate_templates WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certificate template not found'
      });
    }

    const template = {
      ...rows[0],
      elements: rows[0].elements || []
    };

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching certificate template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate template',
      error: error.message
    });
  }
});

// POST /api/certificates/templates - Create new certificate template
// Support: application/json, multipart/form-data (backgroundImage), and fallback text/plain JSON
router.post('/templates', express.text({ type: 'text/plain' }), upload.single('backgroundImage'), async (req, res) => {
  try {
    // Normalize body across content types
    let normalizedBody = req.body;
    const contentType = req.headers['content-type'] || '';

    // If text/plain JSON was sent, parse it
    if (typeof normalizedBody === 'string' && contentType.includes('text/plain')) {
      try {
        normalizedBody = JSON.parse(normalizedBody);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid JSON in text body' });
      }
    }

    if (!normalizedBody || (typeof normalizedBody === 'object' && Object.keys(normalizedBody).length === 0)) {
      return res.status(400).json({ success: false, message: 'Request body is required' });
    }
    
    const {
      name,
      type,
      event_date,
      status = 'draft',
      qr_link,
      width = 800,
      height = 600,
      background_color = '#FFFFFF',
      elements = []
    } = normalizedBody || {};

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required'
      });
    }

    const [result] = await db.execute(`
      INSERT INTO certificate_templates 
      (name, type, event_date, status, qr_link, width, height, background_color, elements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      type,
      event_date || null,
      status,
      qr_link || null,
      parseInt(width),
      parseInt(height),
      background_color,
      JSON.stringify(Array.isArray(elements) ? elements : (typeof elements === 'string' ? (()=>{ try { return JSON.parse(elements); } catch { return []; } })() : []))
    ]);

    // Fetch the created template
    const [newTemplate] = await db.execute(
      'SELECT * FROM certificate_templates WHERE id = ?',
      [result.insertId]
    );

    const template = {
      ...newTemplate[0],
      elements: newTemplate[0].elements || []
    };

    res.status(201).json({
      success: true,
      message: 'Certificate template created successfully',
      data: template
    });
  } catch (error) {
    console.error('Error creating certificate template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create certificate template',
      error: error.message
    });
  }
});

// PUT /api/certificates/templates/:id - Update certificate template
router.put('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      event_date,
      status,
      qr_link,
      width,
      height,
      background_color,
      elements
    } = req.body;

    // Check if template exists
    const [existingTemplate] = await db.execute(
      'SELECT * FROM certificate_templates WHERE id = ?',
      [id]
    );

    if (existingTemplate.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certificate template not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (event_date !== undefined) {
      updates.push('event_date = ?');
      params.push(event_date || null);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (qr_link !== undefined) {
      updates.push('qr_link = ?');
      params.push(qr_link || null);
    }
    if (width !== undefined) {
      updates.push('width = ?');
      params.push(parseInt(width));
    }
    if (height !== undefined) {
      updates.push('height = ?');
      params.push(parseInt(height));
    }
    if (background_color !== undefined) {
      updates.push('background_color = ?');
      params.push(background_color);
    }
    if (elements !== undefined) {
      updates.push('elements = ?');
      params.push(JSON.stringify(elements));
    }

    params.push(id);

    await db.execute(`
      UPDATE certificate_templates 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params);

    // Fetch updated template
    const [updatedTemplate] = await db.execute(
      'SELECT * FROM certificate_templates WHERE id = ?',
      [id]
    );

    const template = {
      ...updatedTemplate[0],
      elements: updatedTemplate[0].elements || []
    };

    res.json({
      success: true,
      message: 'Certificate template updated successfully',
      data: template
    });
  } catch (error) {
    console.error('Error updating certificate template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update certificate template',
      error: error.message
    });
  }
});

// DELETE /api/certificates/templates/:id - Delete certificate template
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const [template] = await db.execute(
      'SELECT * FROM certificate_templates WHERE id = ?',
      [id]
    );

    if (template.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certificate template not found'
      });
    }

    // Delete template from database
    await db.execute('DELETE FROM certificate_templates WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Certificate template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certificate template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certificate template',
      error: error.message
    });
  }
});

// GET /api/certificates/categories - Get certificate categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM certificate_categories ORDER BY name');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching certificate categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate categories',
      error: error.message
    });
  }
});

module.exports = router;