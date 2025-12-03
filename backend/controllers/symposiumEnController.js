const db = require('../db/db');

// Get active content
exports.getContent = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM symposium_en_content WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active content found' 
      });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content',
      error: error.message 
    });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const {
      header_title,
      header_subtitle,
      header_venue,
      header_date,
      about_title,
      about_description,
      objectives_title,
      objectives_list,
      target_audience_title,
      target_audience_description,
      registration_title,
      registration_description,
      registration_button_text,
      registration_button_link
    } = req.body;

    // Deactivate all previous content
    await db.execute('UPDATE symposium_en_content SET is_active = 0');

    // Insert new content
    const [result] = await db.execute(
      `INSERT INTO symposium_en_content (
        header_title, header_subtitle, header_venue, header_date,
        about_title, about_description,
        objectives_title, objectives_list,
        target_audience_title, target_audience_description,
        registration_title, registration_description,
        registration_button_text, registration_button_link,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        header_title,
        header_subtitle,
        header_venue,
        header_date,
        about_title,
        about_description,
        objectives_title,
        JSON.stringify(objectives_list),
        target_audience_title,
        target_audience_description,
        registration_title,
        registration_description,
        registration_button_text,
        registration_button_link
      ]
    );

    res.json({ 
      success: true, 
      message: 'Content updated successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update content',
      error: error.message 
    });
  }
};

// Get content history
exports.getContentHistory = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM symposium_en_content ORDER BY updated_at DESC LIMIT 10'
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching content history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content history',
      error: error.message 
    });
  }
};

