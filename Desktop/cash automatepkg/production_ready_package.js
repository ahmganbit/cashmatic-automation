

// server.js - Express Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// In-memory storage (replace with database in production)
let appData = {
  earnings: {
    daily: 86.23,
    weekly: 604.61,
    monthly: 2587.45,
    total: 15247.89
  },
  campaigns: [
    {
      id: 1,
      name: "AI Tools Affiliate Content",
      type: "affiliate",
      status: "active",
      dailyEarnings: 45.32,
      conversionRate: 3.2,
      nextAction: "Post scheduled in 2 hours",
      affiliateLinks: [
        { tool: "Jasper", commission: 30, link: "https://jasper.ai?ref=user" },
        { tool: "ChatGPT Plus", commission: 25, link: "https://openai.com/chatgpt/plus?ref=user" }
      ]
    },
    {
      id: 2,
      name: "SEO Blog Automation",
      type: "content",
      status: "active",
      dailyEarnings: 28.76,
      conversionRate: 2.8,
      nextAction: "Article publishing in 1 hour",
      platforms: ["WordPress", "Medium", "LinkedIn"]
    },
    {
      id: 3,
      name: "Social Media Automation",
      type: "social",
      status: "active",
      dailyEarnings: 12.15,
      conversionRate: 1.9,
      nextAction: "Engagement round in 30 mins",
      platforms: ["Twitter", "LinkedIn", "Instagram"]
    }
  ],
  contentQueue: [
    {
      id: 1,
      title: "Top 10 AI Writing Tools for 2025",
      platform: "Blog",
      scheduledFor: "2025-07-17T14:00:00Z",
      status: "ready",
      estimatedEarnings: 25,
      content: "AI-generated blog post content here...",
      affiliateLinks: ["jasper", "chatgpt-plus"]
    },
    {
      id: 2,
      title: "How AI is Revolutionizing Affiliate Marketing",
      platform: "LinkedIn",
      scheduledFor: "2025-07-17T16:30:00Z",
      status: "ready",
      estimatedEarnings: 15,
      content: "LinkedIn article content here..."
    }
  ],
  settings: {
    automationEnabled: true,
    dailyGoal: 75,
    apiKeys: {
      openai: process.env.OPENAI_API_KEY,
      wordpress: process.env.WORDPRESS_API_KEY,
      twitter: process.env.TWITTER_API_KEY,
      linkedin: process.env.LINKEDIN_API_KEY
    }
  }
};

// API Routes
app.get('/api/dashboard', (req, res) => {
  res.json({
    earnings: appData.earnings,
    campaigns: appData.campaigns,
    contentQueue: appData.contentQueue,
    automationStatus: appData.settings.automationEnabled ? 'running' : 'paused'
  });
});

app.post('/api/toggle-automation', (req, res) => {
  appData.settings.automationEnabled = !appData.settings.automationEnabled;
  res.json({ 
    status: appData.settings.automationEnabled ? 'running' : 'paused',
    message: `Automation ${appData.settings.automationEnabled ? 'resumed' : 'paused'}`
  });
});

app.post('/api/generate-content', async (req, res) => {
  try {
    const { topic, platform, type } = req.body;
    
    // Simulate AI content generation
    const newContent = {
      id: Date.now(),
      title: `AI-Generated: ${topic || 'Best Passive Income Strategies for 2025'}`,
      platform: platform || 'Blog',
      scheduledFor: new Date(Date.now() + 3600000).toISOString(),
      status: 'processing',
      estimatedEarnings: Math.floor(Math.random() * 40) + 20,
      content: `Generated content for ${topic}...`,
      type: type || 'article'
    };
    
    appData.contentQueue.push(newContent);
    
    // Simulate processing delay
    setTimeout(() => {
      const contentIndex = appData.contentQueue.findIndex(c => c.id === newContent.id);
      if (contentIndex !== -1) {
        appData.contentQueue[contentIndex].status = 'ready';
      }
    }, 3000);
    
    res.json({ 
      success: true, 
      content: newContent,
      message: 'Content generation started'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed' });
  }
});

app.post('/api/setup-campaign', (req, res) => {
  const { type, config } = req.body;
  
  const campaignTemplates = {
    affiliate: {
      name: "New Affiliate Campaign",
      type: "affiliate",
      status: "active",
      dailyEarnings: 0,
      conversionRate: 0,
      nextAction: "Setting up automation...",
      config: {
        products: ["AI Writing Tools", "Marketing Automation", "SEO Tools"],
        platforms: ["Blog", "YouTube", "Email"],
        commission: "30-50%",
        ...config
      }
    },
    content: {
      name: "Content Marketing Campaign",
      type: "content", 
      status: "active",
      dailyEarnings: 0,
      conversionRate: 0,
      nextAction: "Generating initial content...",
      config: {
        topics: ["AI Tools", "Passive Income", "Online Business"],
        frequency: "2-3 posts daily",
        monetization: "Ads + Affiliate",
        ...config
      }
    },
    social: {
      name: "Social Media Campaign",
      type: "social",
      status: "active", 
      dailyEarnings: 0,
      conversionRate: 0,
      nextAction: "Scheduling posts...",
      config: {
        platforms: ["Twitter", "LinkedIn", "Instagram"],
        posting: "6-8 times daily",
        engagement: "Auto-reply enabled",
        ...config
      }
    }
  };
  
  const newCampaign = {
    id: Date.now(),
    ...campaignTemplates[type]
  };
  
  appData.campaigns.push(newCampaign);
  
  res.json({
    success: true,
    campaign: newCampaign,
    message: `${campaignTemplates[type].name} created successfully`
  });
});

app.get('/api/analytics', (req, res) => {
  const analytics = {
    dailyStats: {
      clicks: 234,
      conversions: 7,
      revenue: appData.earnings.daily,
      ctr: 3.2,
      conversionRate: 2.8
    },
    weeklyTrend: [
      { day: 'Mon', earnings: 67.23, clicks: 189 },
      { day: 'Tue', earnings: 78.45, clicks: 234 },
      { day: 'Wed', earnings: 92.17, clicks: 267 },
      { day: 'Thu', earnings: 85.63, clicks: 245 },
      { day: 'Fri', earnings: 96.34, clicks: 289 },
      { day: 'Sat', earnings: 89.12, clicks: 256 },
      { day: 'Sun', earnings: 86.23, clicks: 234 }
    ],
    topPerformers: [
      { title: "AI Writing Tools Review", earnings: 156.78, platform: "Blog" },
      { title: "ChatGPT vs Claude Comparison", earnings: 134.56, platform: "YouTube" },
      { title: "Passive Income with AI", earnings: 98.23, platform: "LinkedIn" }
    ]
  };
  
  res.json(analytics);
});

// Automation cron jobs
cron.schedule('*/5 * * * *', () => {
  if (appData.settings.automationEnabled) {
    // Simulate earnings update
    const increment = Math.random() * 2;
    appData.earnings.daily += increment;
    appData.earnings.weekly += increment;
    appData.earnings.monthly += increment;
    appData.earnings.total += increment;
    
    console.log(`[${new Date().toISOString()}] Earnings updated: +$${increment.toFixed(2)}`);
  }
});

cron.schedule('0 */2 * * *', () => {
  if (appData.settings.automationEnabled) {
    // Auto-publish ready content
    const readyContent = appData.contentQueue.filter(c => c.status === 'ready');
    readyContent.forEach(content => {
      if (new Date(content.scheduledFor) <= new Date()) {
        content.status = 'published';
        console.log(`[${new Date().toISOString()}] Published: ${content.title}`);
      }
    });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Passive Income Automation Tool running on port ${PORT}`);
  console.log(`💰 Dashboard: http://localhost:${PORT}`);
  console.log(`🤖 Automation: ${appData.settings.automationEnabled ? 'ENABLED' : 'DISABLED'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// .env.example
/*
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
WORDPRESS_API_KEY=your_wordpress_api_key
TWITTER_API_KEY=your_twitter_api_key
LINKEDIN_API_KEY=your_linkedin_api_key
MAILGUN_API_KEY=your_mailgun_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret_here
*/

// Dockerfile
/*
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
*/

// docker-compose.yml
/*
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/dashboard"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  redis_data:
*/

// render.yaml - Render deployment config
/*
services:
  - type: web
    name: passive-income-automation
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /api/dashboard
    envVars:
      - key: NODE_ENV
        value: production
      - key: OPENAI_API_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
*/

// vercel.json - Vercel deployment config
/*
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
*/

// Railway deployment config (railway.toml)
/*
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/api/dashboard"
healthcheckTimeout = 300
restartPolicyType = "on_failure"

[env]
NODE_ENV = "production"
*/

// Heroku Procfile
/*
web: npm start
*/

// README.md deployment guide
/*
# Passive Income Automation Tool - Deployment Guide

## Quick Deploy Options

### 1. Render (Recommended)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically

### 2. Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import project from GitHub
2. Add environment variables
3. Deploy with one click

### 3. Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### 4. Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=your_key
git push heroku main
```

### 5. Docker
```bash
docker build -t passive-income-tool .
docker run -p 3000:3000 -e NODE_ENV=production passive-income-tool
```

## Required Environment Variables

- `OPENAI_API_KEY`: For AI content generation
- `WORDPRESS_API_KEY`: For blog automation
- `TWITTER_API_KEY`: For social media posting
- `LINKEDIN_API_KEY`: For LinkedIn automation
- `MAILGUN_API_KEY`: For email automation
- `DATABASE_URL`: For data persistence
- `JWT_SECRET`: For authentication

## Post-Deployment Setup

1. Access your deployed app URL
2. Complete the affiliate program setup
3. Connect your social media accounts
4. Enable automation
5. Monitor daily earnings

## Monitoring & Maintenance

- Health checks run every 30 seconds
- Automatic restart on failures
- Logs available in platform dashboard
- Daily earnings reports via email
*/