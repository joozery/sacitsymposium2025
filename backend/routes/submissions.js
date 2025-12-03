const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');

// Get all submissions with filters
router.get('/', submissionsController.getAllSubmissions);

// Get single submission
router.get('/:id', submissionsController.getSubmission);

// Update submission review status
router.put('/:id/review', submissionsController.updateReviewStatus);

// Add review comment
router.post('/:id/comments', submissionsController.addComment);

// Get submission statistics
router.get('/stats/overview', submissionsController.getStatistics);

module.exports = router;

