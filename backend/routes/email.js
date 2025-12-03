const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Send email to a submitter
router.post('/send', emailController.sendEmailToSubmitter);

// Send bulk email
router.post('/bulk', emailController.sendBulkEmail);

module.exports = router;

