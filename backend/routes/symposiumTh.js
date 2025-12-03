const express = require('express');
const router = express.Router();
const symposiumEnController = require('../controllers/symposiumEnController');

// Get active content
router.get('/', symposiumEnController.getContent);

// Update content
router.put('/', symposiumEnController.updateContent);

// Get content history
router.get('/history', symposiumEnController.getContentHistory);

module.exports = router;

