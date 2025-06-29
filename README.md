# 🚀 AI News Dashboard with Summarizer

A modern, full-stack news dashboard application that fetches real-time news from NewsAPI and generates AI-powered summaries using Google's Gemini AI. Built with React 19, Node.js/Express, and MongoDB.

![News Dashboard](./public/newspaper.png)

## ✨ Features

- 📰 **Real-time News**: Fetch latest news from NewsAPI across multiple categories
- 🤖 **AI Summarization**: Generate concise summaries using Google Gemini AI
- 💾 **Save Articles**
- 🎨 **Modern UI**: Glassmorphism design with light/dark mode toggle
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔍 **Search**: Find specific news articles with keyword search
- 📊 **Categories**: Browse news by Business, Technology, Sports, Health, etc.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with automatic JSX runtime
- **Vite 6** - Fast build tool with SWC compiler
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with glassmorphism effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-origin resource sharing

### APIs & Services
- **NewsAPI** - Real-time news data
- **Google Gemini AI** - AI text summarization
- **Vercel** - Deployment platform

## 🚀 Live Demo

- **Frontend**: [https://ktj-ass-4.vercel.app](https://ktj-ass-4.vercel.app)
- **Backend API**: [https://ktj-ass-4-z82a.vercel.app](https://ktj-ass-4-z82a.vercel.app)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - Database (local or MongoDB Atlas)
- **NewsAPI Key** - [Get free key](https://newsapi.org/)
- **Google Gemini API Key** - [Get free key](https://makersuite.google.com/)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vikashgupta16/KTJ-ASS4.git
cd KTJ-ASS4
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Configuration

Create environment files in the root directory:

#### `.env.local` (for development)
```bash
# Frontend Environment 
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:5001/api

# Backend Environment
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key_here

# Server configuration
PORT=5001
NODE_ENV=development
```

#### `.env.production` (for production)
```bash
# Production Environment Configuration
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=https://your-backend-deployment.vercel.app/api

# Backend Environment
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key_here

PORT=5001
NODE_ENV=production
```

### 4. Get API Keys

#### NewsAPI Key
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key

#### Google Gemini AI Key
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create a new project
3. Generate an API key

#### MongoDB (Choose one option)

**Option A: MongoDB Atlas (Recommended)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Windows - Download from mongodb.com

# Start MongoDB
mongod
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
```bash
cd backend
node index.js
# Backend will run on http://localhost:5001
```

2. **Start the Frontend Development Server**
```bash
# In a new terminal, from the root directory
npm run dev
# Frontend will run on http://localhost:5173 (or next available port)
```

3. **Access the Application**
- Open your browser and go to `http://localhost:5173`
- The frontend will automatically proxy API requests to the backend

### Production Build

```bash
# Build the frontend for production
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
KTJ-ASS4/
├── 📁 backend/
│   ├── 📁 controllers/     # Request handlers
│   ├── 📁 middleware/      # Auth and validation
│   ├── 📁 models/         # MongoDB schemas
│   ├── 📁 routes/         # API endpoints
│   ├── 📁 services/       # Business logic
│   ├── 📄 db.js           # Database connection
│   ├── 📄 index.js        # Server entry point
│   └── 📄 package.json    # Backend dependencies
├── 📁 src/
│   ├── 📁 components/     # React components
│   ├── 📁 services/       # API clients
│   ├── 📄 App.jsx         # Main App component
│   ├── 📄 App.css         # Global styles
│   └── 📄 main.jsx        # React entry point
├── 📁 public/             # Static assets
├── 📄 package.json        # Frontend dependencies
├── 📄 vite.config.js      # Vite configuration
├── 📄 vercel.json         # Deployment config
└── 📄 README.md           # This file
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
cd backend
npm start            # Start production server
npm run dev          # Start with nodemon (development)
```

## 🌐 API Endpoints

### News Endpoints
- `GET /api/news/headlines` - Top headlines
- `GET /api/news/category?category=general` - News by category
- `GET /api/news/search?q=keyword` - Search articles

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `POST /api/user/save-article` - Save article

### AI Summarizer
- `POST /api/summarizer/summarize` - Generate AI summary

## 🎨 Features Guide

### Browse News
- Navigate through different categories using the tab bar
- Scroll through articles in each category
- Click on any article to view details

### AI Summarization
- Click on an article to open the detail view
- Click "Generate AI Summary" to get a concise summary
- Summaries are generated using Google's Gemini AI

### User Account
- Register for an account to save articles
- Login to access saved articles
- View your saved articles in "My Summaries"

### Theme Toggle
- Use the theme toggle in the header to switch between light and dark modes
- Theme preference is saved locally

## 🚀 Deployment

### Deploy to Vercel

1. **Prepare for Deployment**
```bash
# Make sure your .env.production is configured
# Commit all changes to Git
git add .
git commit -m "Ready for deployment"
git push
```

2. **Deploy Frontend**
- Connect your GitHub repository to Vercel
- Configure environment variables in Vercel dashboard
- Deploy automatically on every push

3. **Deploy Backend**
- Create a separate Vercel project for the backend
- Set environment variables
- Update frontend `.env.production` with backend URL

### Environment Variables for Vercel

Set these in your Vercel dashboard:

**Frontend Project:**
- `VITE_NEWS_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_API_URL`

**Backend Project:**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GEMINI_API_KEY`
- `NEWS_API_KEY`
- `NODE_ENV=production`

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error" when fetching news**
   - Make sure backend server is running
   - Check if PORT 5001 is available
   - Verify API keys are correctly set

2. **JSX Runtime Error**
   - Make sure you're using React 19 and Vite 6+
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

3. **MongoDB Connection Failed**
   - Check your MongoDB URI
   - Ensure MongoDB service is running (if local)
   - Verify network access (if using Atlas)

4. **API Key Issues**
   - Verify NewsAPI key is valid and not expired
   - Check Gemini AI API key has correct permissions
   - Ensure keys are properly set in environment files

### Development Tips

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart development servers
# Kill all node processes
pkill node
# Then restart backend and frontend

# Check if ports are in use
netstat -an | grep :5001
netstat -an | grep :5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikash Gupta**
- GitHub: [@vikashgupta16](https://github.com/vikashgupta16)

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org/) for providing news data
- [Google Gemini AI](https://ai.google.dev/) for AI summarization
- [Vercel](https://vercel.com/) for hosting and deployment
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database services

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Create an issue on GitHub
3. Contact the developer

**Happy coding! 🚀**