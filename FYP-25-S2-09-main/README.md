# Wise Fitness Website

A dynamic fitness website with Firebase integration, testimonials system, and responsive design.

## 🚀 Features

- **Dynamic Content Loading** from Firebase Firestore
- **AI-Curated Testimonials** with sentiment analysis
- **Responsive Design** for all devices
- **User & Business Registration** systems
- **Admin Dashboard** for content management
- **Real-time Updates** via Firebase

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Render

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🌐 Deployment

This project is configured for deployment on Render:

1. Connect your GitHub repository to Render
2. Choose "Web Service"
3. Select "Node" as the environment
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Publish Directory**: (leave empty)

## 📁 Project Structure

```
├── FYP Websites/           # Frontend files
│   ├── index.html         # Main landing page
│   ├── Login.html         # User login
│   ├── Signup.html        # User registration
│   ├── assets/            # Images and static files
│   └── ...                # Other HTML pages
├── server.js              # Express server
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## 🔧 Configuration

The application uses Firebase for:
- User authentication
- Content management
- Testimonials storage
- Real-time updates

## 📱 Pages

- **Landing Page** (`index.html`) - Main website
- **User Registration** (`Signup.html`) - User signup
- **Business Registration** (`BusinessUserSignup.html`) - Business signup
- **Login** (`Login.html`) - User authentication
- **Admin Dashboard** (`SystemAdmin.html`) - Admin panel
- **Content Management** (`ManageLandingPage.html`) - CMS

## 🎯 Firebase Collections

- `landingPage` - Website content
- `testimonial` - User testimonials
- `businessUserTestimonial` - Business testimonials
- `users` - User profiles
- `businessUsers` - Business profiles

## 🚀 Live Demo

Visit: [Your Render URL will be here]

## 👥 Team

FYP-25-S2-09 - Wise Fitness Development Team
