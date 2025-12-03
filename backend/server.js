const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from Upload directory
app.use('/uploads', express.static(path.join(__dirname, 'Upload')));

// Import routes
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const registrationRoutes = require('./routes/registration');
const speakersRoutes = require('./routes/speakers');
const exhibitionsRoutes = require('./routes/exhibitions');
const mediaRoutes = require('./routes/media');
const folderImagesRoutes = require('./routes/folderImages');
const uploadRoutes = require('./routes/upload');
const emailRoutes = require('./routes/email');
const worksRoutes = require('./routes/works');
const attendeesRoutes = require('./routes/attendees');
const symposiumThRoutes = require('./routes/symposiumTh');
const symposiumEnRoutes = require('./routes/symposiumEn');
const certificatesRoutes = require('./routes/certificates');
const setupRoutes = require('./routes/setup');
const submissionsRoutes = require('./routes/submissions');
const workCategoriesRoutes = require('./routes/workCategories');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/speakers', speakersRoutes);
app.use('/api/exhibitions', exhibitionsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/folder-images', folderImagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/works', worksRoutes);
app.use('/api/attendees', attendeesRoutes);
app.use('/api/symposium-th', symposiumThRoutes);
app.use('/api/symposium-en', symposiumEnRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/work-categories', workCategoriesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test database connection
db.query('SELECT 1', (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'Upload')}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

