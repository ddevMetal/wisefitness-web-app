const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://www.gstatic.com", "https://apis.google.com"],
      connectSrc: ["'self'", "https://firebase.googleapis.com", "https://firestore.googleapis.com"]
    }
  }
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again later.'
});

app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS for all routes with security settings
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://your-domain.com'] : // Replace with your actual domain
    ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the "FYP Websites" directory
app.use(express.static(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites')));

// Input validation middleware
const validateInput = (req, res, next) => {
  // Sanitize common XSS attempts
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
  };

  // Recursively sanitize object properties
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

// Apply validation to all routes
app.use(validateInput);

// Authentication middleware (simple example - implement proper JWT in production)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // In production, validate JWT token here
  // For now, just check if token exists
  const token = authHeader.substring(7);
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  next();
};

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  // In production, check if user has admin role from JWT
  // For now, just apply basic auth check
  requireAuth(req, res, next);
};

// Public routes (GET) - No authentication required
// Homepage and public information pages
app.get('/', (req, res) => {
  console.log(`📄 Serving: index.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
});

app.get('/index.html', (req, res) => {
  console.log(`📄 Serving: index.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
});

app.get('/services.html', (req, res) => {
  console.log(`� Serving: Services.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Services.html'));
});

app.get('/events.html', (req, res) => {
  console.log(`📄 Serving: Events.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Events.html'));
});

app.get('/leaderboard.html', (req, res) => {
  console.log(`📄 Serving: Leaderboard.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Leaderboard.html'));
});

app.get('/posts.html', (req, res) => {
  console.log(`📄 Serving: Posts.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Posts.html'));
});

// Authentication routes (GET for forms, POST for actions)
app.get('/login.html', (req, res) => {
  console.log(`📄 Serving: Login.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Login.html'));
});

app.get('/signup.html', (req, res) => {
  console.log(`📄 Serving: Signup.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'Signup.html'));
});

app.get('/businessusersignup.html', (req, res) => {
  console.log(`📄 Serving: BusinessUserSignup.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'BusinessUserSignup.html'));
});

// POST routes for authentication (with rate limiting)
app.post('/api/login', authLimiter, (req, res) => {
  console.log('🔐 Login attempt');
  
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Here you would typically:
  // 1. Query database for user
  // 2. Compare hashed passwords
  // 3. Generate JWT token
  // 4. Return token or redirect
  
  res.json({ message: 'Login endpoint - implement authentication logic here' });
});

app.post('/api/signup', authLimiter, (req, res) => {
  console.log('📝 Signup attempt');
  
  const { email, password, confirmPassword, name } = req.body;
  
  // Validate required fields
  if (!email || !password || !confirmPassword || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  
  // Here you would typically:
  // 1. Check if user already exists
  // 2. Hash password
  // 3. Store in database
  // 4. Send welcome email
  
  res.json({ message: 'Signup endpoint - implement user creation logic here' });
});

app.post('/api/business-signup', authLimiter, (req, res) => {
  console.log('🏢 Business signup attempt');
  
  const { businessName, ownerName, email, password, businessType } = req.body;
  
  // Validate required fields
  if (!businessName || !ownerName || !email || !password || !businessType) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Additional business validation logic here
  
  res.json({ message: 'Business signup endpoint - implement business registration logic here' });
});

// Protected user routes (require authentication)
app.get('/businessuser.html', requireAuth, (req, res) => {
  console.log(`📄 Serving: BusinessUser.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'BusinessUser.html'));
});

app.get('/businessuserprofile.html', requireAuth, (req, res) => {
  console.log(`📄 Serving: BusinessUserProfile.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'BusinessUserProfile.html'));
});

app.get('/businessusersettings.html', requireAuth, (req, res) => {
  console.log(`📄 Serving: BusinessUserSettings.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'BusinessUserSettings.html'));
});

app.get('/managebusiness.html', requireAuth, (req, res) => {
  console.log(`📄 Serving: ManageBusiness.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'ManageBusiness.html'));
});

// POST routes for user actions
app.post('/api/feedback', requireAuth, (req, res) => {
  console.log('💭 Feedback submission');
  
  const { rating, comment, category } = req.body;
  
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  res.json({ message: 'Feedback submitted successfully' });
});

app.put('/api/profile', requireAuth, (req, res) => {
  console.log('👤 Profile update');
  
  const { name, email, phone } = req.body;
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }
  
  res.json({ message: 'Profile updated successfully' });
});

// Admin routes (require admin privileges)
app.get('/systemadmin.html', requireAdmin, (req, res) => {
  console.log(`📄 Serving: SystemAdmin.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'SystemAdmin.html'));
});

app.get('/manageusers.html', requireAdmin, (req, res) => {
  console.log(`📄 Serving: ManageUsers.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'ManageUsers.html'));
});

app.get('/pendingapplications.html', requireAdmin, (req, res) => {
  console.log(`📄 Serving: PendingApplications.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'PendingApplications.html'));
});

app.get('/managelandingpage.html', requireAdmin, (req, res) => {
  console.log(`📄 Serving: ManageLandingPage.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'ManageLandingPage.html'));
});

app.get('/database_setup.html', requireAdmin, (req, res) => {
  console.log(`📄 Serving: database_setup.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'database_setup.html'));
});

// Admin POST routes
app.post('/api/admin/approve-application', requireAdmin, (req, res) => {
  console.log('✅ Application approval');
  
  const { applicationId, action } = req.body;
  
  if (!applicationId || !action) {
    return res.status(400).json({ error: 'Application ID and action are required' });
  }
  
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Action must be approve or reject' });
  }
  
  res.json({ message: `Application ${action}d successfully` });
});

app.delete('/api/admin/users/:userId', requireAdmin, (req, res) => {
  console.log('🗑️ User deletion');
  
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  res.json({ message: 'User deleted successfully' });
});

// Feedback form route
app.get('/feedback-form.html', (req, res) => {
  console.log(`📄 Serving: feedback-form.html`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'feedback-form.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Catch-all route for undefined routes
app.get('*', (req, res) => {
  console.log(`❓ Unknown route: ${req.path}, serving index.html as fallback`);
  res.sendFile(path.join(__dirname, 'FYP-25-S2-09-main', 'FYP Websites', 'index.html'));
});

// Handle 404 for non-GET requests
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.path
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err.stack);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message,
      stack: err.stack
    });
  }
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
