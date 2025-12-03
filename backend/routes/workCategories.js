const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all work categories
router.get('/', async (req, res) => {
  try {
    const { active_only } = req.query;
    
    let query = 'SELECT * FROM work_categories';
    const params = [];
    
    if (active_only === 'true') {
      query += ' WHERE is_active = 1';
    }
    
    query += ' ORDER BY display_order ASC, name ASC';
    
    const [categories] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching work categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work categories',
      error: error.message
    });
  }
});

// Get single work category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categories] = await db.execute(
      'SELECT * FROM work_categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Work category not found'
      });
    }
    
    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Error fetching work category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work category',
      error: error.message
    });
  }
});

// Create work category
router.post('/', async (req, res) => {
  try {
    const {
      name,
      name_en,
      description,
      icon,
      color,
      display_order,
      is_active
    } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    const [result] = await db.execute(
      `INSERT INTO work_categories 
       (name, name_en, description, icon, color, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        name_en || null,
        description || null,
        icon || null,
        color || '#533193',
        display_order || 0,
        is_active !== undefined ? is_active : 1
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Work category created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating work category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create work category',
      error: error.message
    });
  }
});

// Update work category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      name_en,
      description,
      icon,
      color,
      display_order,
      is_active
    } = req.body;
    
    // Check if category exists
    const [existing] = await db.execute(
      'SELECT id FROM work_categories WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Work category not found'
      });
    }
    
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (name_en !== undefined) {
      updates.push('name_en = ?');
      values.push(name_en);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      values.push(color);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    values.push(id);
    
    await db.execute(
      `UPDATE work_categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    res.json({
      success: true,
      message: 'Work category updated successfully'
    });
  } catch (error) {
    console.error('Error updating work category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update work category',
      error: error.message
    });
  }
});

// Delete work category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const [existing] = await db.execute(
      'SELECT id FROM work_categories WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Work category not found'
      });
    }
    
    await db.execute('DELETE FROM work_categories WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Work category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting work category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete work category',
      error: error.message
    });
  }
});

module.exports = router;

