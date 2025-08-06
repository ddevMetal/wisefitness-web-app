const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "FYP-25-S2-09-main/FYP Websites" directory
app.use(express.static(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites')));

// Handle routing - serve specific HTML files
app.get('*', (req, res) => {
  const requestedFile = req.path;
  console.log(`🔍 Requested path: ${requestedFile}`);
  
  // List of your HTML files (without leading slash for file system)
  const htmlFiles = [
    'index.html',
    'Login.html',
    'Signup.html',
    'BusinessUserSignup.html',
    'BusinessUser.html',
    'BusinessUserProfile.html',
    'BusinessUserSettings.html',
    'database_setup.html',
    'Events.html',
    'feedback-form.html',
    'Leaderboard.html',
    'ManageBusiness.html',
    'ManageLandingPage.html',
    'ManageUsers.html',
    'PendingApplications.html',
    'Posts.html',
    'Services.html',
    'SystemAdmin.html'
  ];

  // Remove leading slash for file matching
  const fileName = requestedFile.startsWith('/') ? requestedFile.substring(1) : requestedFile;
  
  // If requesting root, serve index.html
  if (requestedFile === '/') {
    console.log(`📄 Serving: index.html`);
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
  }
  // If requesting a specific HTML file that exists, serve it
  else if (htmlFiles.includes(fileName)) {
    console.log(`📄 Serving: ${fileName}`);
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', fileName));
  }
  // For any other route, check if it's a static asset first
  else {
    console.log(`❓ Unknown route: ${requestedFile}, serving index.html as fallback`);
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
  console.log(`📁 Serving files from: ${path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites')}`);
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
