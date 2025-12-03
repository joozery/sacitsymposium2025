const db = require('../db/db');

// Get all submissions with filters
exports.getAllSubmissions = async (req, res) => {
  try {
    const { 
      status, 
      type, 
      year, 
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    let query = `
      SELECT 
        r.*,
        u.email,
        u.first_name,
        u.last_name,
        u.phone
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    
    if (type) {
      query += ' AND r.registration_type = ?';
      params.push(type);
    }
    
    if (year) {
      query += ' AND r.registration_year = ?';
      params.push(year);
    }
    
    if (search) {
      query += ` AND (
        u.email LIKE ? OR 
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR
        r.work_title LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    // Count total
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;
    
    // Add pagination
    const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeOffset = (safePage - 1) * safeLimit;
    query += ` ORDER BY r.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    const [submissions] = await db.execute(query, params);
    
    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

// Get single submission
exports.getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [submissions] = await db.execute(
      `SELECT 
        r.*,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.organization
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?`,
      [id]
    );
    
    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: submissions[0]
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
};

// Update submission review status
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      review_status,
      review_score,
      review_comments,
      reviewer_id,
      reviewer_name,
      conditions,
      status
    } = req.body;
    
    console.log('📝 Update review request:', { id, body: req.body });
    
    // Check if submission exists
    const [existing] = await db.execute(
      'SELECT id FROM registrations WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    const updates = [];
    const values = [];
    
    if (review_status !== undefined) {
      updates.push('review_status = ?');
      values.push(review_status);
    }
    
    if (review_score !== undefined && review_score !== null && review_score !== '') {
      updates.push('review_score = ?');
      values.push(review_score);
    }
    
    if (review_comments !== undefined) {
      updates.push('review_comments = ?');
      values.push(review_comments);
    }
    
    if (conditions !== undefined) {
      updates.push('conditions = ?');
      values.push(conditions);
    }
    
    if (reviewer_id !== undefined) {
      updates.push('reviewer_id = ?');
      values.push(reviewer_id);
    }
    
    if (reviewer_name !== undefined && reviewer_name !== null && reviewer_name !== '') {
      updates.push('reviewer_name = ?');
      values.push(reviewer_name);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    updates.push('reviewed_at = NOW()');
    
    if (updates.length === 1) { // Only reviewed_at
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    values.push(id);
    
    console.log('📝 UPDATE query:', { updates, values });
    
    await db.execute(
      `UPDATE registrations SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    console.log('✅ Review updated successfully');
    
    res.json({
      success: true,
      message: 'Review status updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating review status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status',
      error: error.message
    });
  }
};

// Add review comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, reviewer_id } = req.body;
    
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }
    
    // Get existing comments
    const [submission] = await db.execute(
      'SELECT review_comments FROM registrations WHERE id = ?',
      [id]
    );
    
    if (submission.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    let comments = [];
    try {
      comments = submission[0].review_comments ? JSON.parse(submission[0].review_comments) : [];
    } catch (e) {
      comments = [];
    }
    
    comments.push({
      comment,
      reviewer_id,
      created_at: new Date().toISOString()
    });
    
    await db.execute(
      'UPDATE registrations SET review_comments = ? WHERE id = ?',
      [JSON.stringify(comments), id]
    );
    
    res.json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Get submission statistics
exports.getStatistics = async (req, res) => {
  try {
    const { year } = req.query;
    
    let query = 'SELECT registration_year FROM registrations WHERE 1=1';
    const params = [];
    
    if (year) {
      query += ' AND registration_year = ?';
      params.push(year);
    }
    
    // Total submissions
    const [totalResult] = await db.execute(
      query.replace('registration_year', 'COUNT(*) as total'),
      params
    );
    
    // By status
    const [statusResult] = await db.execute(
      query.replace('registration_year', 'status, COUNT(*) as count') + ' GROUP BY status',
      params
    );
    
    // By type
    const [typeResult] = await db.execute(
      query.replace('registration_year', 'registration_type, COUNT(*) as count') + ' GROUP BY registration_type',
      params
    );
    
    // By review status
    const [reviewResult] = await db.execute(
      query.replace('registration_year', 'review_status, COUNT(*) as count') + ' GROUP BY review_status',
      params
    );
    
    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        by_status: statusResult,
        by_type: typeResult,
        by_review_status: reviewResult
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

