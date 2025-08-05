const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "FYP Websites" directory
app.use(express.static(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  // Check if the request is for a specific HTML file
  const requestedFile = req.path;
  
  // List of your HTML files
  const htmlFiles = [
    '/index.html',
    '/Login.html',
    '/Signup.html',
    '/BusinessUserSignup.html',
    '/BusinessUser.html',
    '/BusinessUserProfile.html',
    '/BusinessUserSettings.html',
    '/database_setup.html',
    '/Events.html',
    '/feedback-form.html',
    '/Leaderboard.html',
    '/ManageBusiness.html',
    '/ManageLandingPage.html',
    '/ManageUsers.html',
    '/PendingApplications.html',
    '/Posts.html',
    '/Services.html',
    '/SystemAdmin.html'
  ];

  // If requesting a specific HTML file, serve it
  if (htmlFiles.includes(requestedFile)) {
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', requestedFile));
  } 
  // If requesting root, serve index.html
  else if (requestedFile === '/') {
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
  }
  // For any other route, serve index.html (SPA behavior)
  else {
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Wise Fitness server is running on port ${PORT}`);
  console.log(`📱 Access your website at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  process.exit(0);
});
