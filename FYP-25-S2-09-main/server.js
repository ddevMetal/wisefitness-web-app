const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "FYP Websites" directory
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
    'ManageLandingPage.html',
    'ManageUsers.html',
    'PendingApplications.html',
    'Posts.html',
    'Services.html',
    'SystemAdmin.html'
  ];

  // Remove leading slash for file matching and handle case insensitivity
  const fileName = requestedFile.startsWith('/') ? requestedFile.substring(1) : requestedFile;
  
  // Find matching file (case insensitive)
  const matchingFile = htmlFiles.find(file => 
    file.toLowerCase() === fileName.toLowerCase()
  );
  
  // If requesting root, serve index.html
  if (requestedFile === '/') {
    console.log(`📄 Serving: index.html`);
    res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
  }
  // If requesting a specific HTML file that exists, serve it
  else if (matchingFile) {
    console.log(`📄 Serving: ${matchingFile}`);
    
    // For ManageLandingPage.html, inject environment variables
    if (matchingFile === 'ManageLandingPage.html') {
      const fs = require('fs');
      let htmlContent = fs.readFileSync(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', matchingFile), 'utf8');
      
      // Inject OpenAI API key
      const apiKey = process.env.OPENAI_API_KEY || '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';
      htmlContent = htmlContent.replace(
        /const OPENAI_API_KEY = '[^']*';/,
        `const OPENAI_API_KEY = '${apiKey}';`
      );
      
      res.send(htmlContent);
    } else {
      res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', matchingFile));
    }
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
