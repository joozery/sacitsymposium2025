const db = require('../db/db');

// Get active symposium EN content
exports.getContent = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM symposium_en_content WHERE is_active = TRUE ORDER BY id DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active content found'
      });
    }

    const content = rows[0];
    
    // Parse JSON fields
    const parsedContent = {
      ...content,
      why_sacit_programs: content.why_sacit_programs ? JSON.parse(content.why_sacit_programs) : [],
      objectives: content.objectives ? JSON.parse(content.objectives) : [],
      program_format: content.program_format ? JSON.parse(content.program_format) : [],
      presentation_categories: content.presentation_categories ? JSON.parse(content.presentation_categories) : {},
      target_participants: content.target_participants ? JSON.parse(content.target_participants) : [],
      timeline: content.timeline ? JSON.parse(content.timeline) : [],
      contact_persons: content.contact_persons ? JSON.parse(content.contact_persons) : []
    };

    res.json({
      success: true,
      data: parsedContent
    });
  } catch (error) {
    console.error('❌ Error fetching symposium EN content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message
    });
  }
};

// Update symposium EN content
exports.updateContent = async (req, res) => {
  try {
    const {
      header_title,
      header_main_title,
      header_theme,
      header_date,
      header_venue,
      why_sacit_content,
      why_sacit_programs,
      objectives,
      program_format,
      presentation_categories,
      target_participants,
      timeline,
      project_lead,
      contact_persons
    } = req.body;

    // Get current active content
    const [current] = await db.execute(
      'SELECT id FROM symposium_en_content WHERE is_active = TRUE ORDER BY id DESC LIMIT 1'
    );

    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active content found to update'
      });
    }

    const contentId = current[0].id;

    // Stringify JSON fields
    const why_sacit_programs_json = typeof why_sacit_programs === 'string' ? why_sacit_programs : JSON.stringify(why_sacit_programs || []);
    const objectives_json = typeof objectives === 'string' ? objectives : JSON.stringify(objectives || []);
    const program_format_json = typeof program_format === 'string' ? program_format : JSON.stringify(program_format || []);
    const presentation_categories_json = typeof presentation_categories === 'string' ? presentation_categories : JSON.stringify(presentation_categories || {});
    const target_participants_json = typeof target_participants === 'string' ? target_participants : JSON.stringify(target_participants || []);
    const timeline_json = typeof timeline === 'string' ? timeline : JSON.stringify(timeline || []);
    const contact_persons_json = typeof contact_persons === 'string' ? contact_persons : JSON.stringify(contact_persons || []);

    await db.execute(
      `UPDATE symposium_en_content 
       SET header_title = ?,
           header_main_title = ?,
           header_theme = ?,
           header_date = ?,
           header_venue = ?,
           why_sacit_content = ?,
           why_sacit_programs = ?,
           objectives = ?,
           program_format = ?,
           presentation_categories = ?,
           target_participants = ?,
           timeline = ?,
           project_lead = ?,
           contact_persons = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        header_title,
        header_main_title,
        header_theme,
        header_date,
        header_venue,
        why_sacit_content,
        why_sacit_programs_json,
        objectives_json,
        program_format_json,
        presentation_categories_json,
        target_participants_json,
        timeline_json,
        project_lead,
        contact_persons_json,
        contentId
      ]
    );

    console.log(`✅ Symposium EN content updated (ID: ${contentId})`);

    res.json({
      success: true,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating symposium EN content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: error.message
    });
  }
};

// Get content history (all versions)
exports.getContentHistory = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, header_main_title, updated_at, updated_by, is_active FROM symposium_en_content ORDER BY updated_at DESC'
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('❌ Error fetching content history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content history',
      error: error.message
    });
  }
};

