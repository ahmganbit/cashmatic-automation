// server.js - CashMatic Automation System
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
      name: "ClickFunnels PLR Campaign",
      type: "affiliate",
      status: "active",
      dailyEarnings: 45.32,
      conversionRate: 3.2,
      nextAction: "Email sequence running",
      affiliateLinks: [
        { tool: "ClickFunnels", commission: 497, link: "https://clickfunnels.com?ref=cashmatic" },
        { tool: "GetResponse", commission: 120, link: "https://getresponse.com?ref=cashmatic" }
      ]
    },
    {
      id: 2,
      name: "Premium Hosting Reviews",
      type: "content",
      status: "active",
      dailyEarnings: 28.76,
      conversionRate: 2.8,
      nextAction: "Liquid Web review publishing",
      affiliateLinks: [
        { tool: "Liquid Web", commission: 1000, link: "https://liquidweb.com?ref=cashmatic" }
      ]
    }
  ],
  automations: [
    {
      id: 1,
      name: "Email Sequence Automation",
      status: "running",
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 3600000).toISOString()
    },
    {
      id: 2,
      name: "Social Media Posting",
      status: "running",
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 7200000).toISOString()
    }
  ]
};

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CashMatic - Automated Income Systems</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                text-align: center; 
                max-width: 800px; 
                padding: 2rem;
                background: rgba(255,255,255,0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 3rem; margin-bottom: 1rem; }
            p { font-size: 1.2rem; margin-bottom: 2rem; }
            .stats { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                gap: 1rem; 
                margin: 2rem 0; 
            }
            .stat { 
                background: rgba(255,255,255,0.2); 
                padding: 1rem; 
                border-radius: 10px; 
            }
            .stat h3 { font-size: 2rem; }
            .cta { 
                background: #ff6b6b; 
                color: white; 
                padding: 1rem 2rem; 
                border: none; 
                border-radius: 50px; 
                font-size: 1.1rem; 
                cursor: pointer; 
                text-decoration: none;
                display: inline-block;
                margin: 1rem;
            }
            .api-info {
                background: rgba(255,255,255,0.1);
                padding: 1rem;
                border-radius: 10px;
                margin-top: 2rem;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 CashMatic</h1>
            <p>Automated Income Systems for Entrepreneurs</p>
            
            <div class="stats">
                <div class="stat">
                    <h3>$${appData.earnings.daily}</h3>
                    <p>Daily Earnings</p>
                </div>
                <div class="stat">
                    <h3>$${appData.earnings.monthly}</h3>
                    <p>Monthly Revenue</p>
                </div>
                <div class="stat">
                    <h3>${appData.campaigns.length}</h3>
                    <p>Active Campaigns</p>
                </div>
                <div class="stat">
                    <h3>${appData.automations.length}</h3>
                    <p>Running Automations</p>
                </div>
            </div>
            
            <a href="/dashboard" class="cta">View Dashboard</a>
            <a href="/api/status" class="cta">API Status</a>
            
            <div class="api-info">
                <h3>🔗 API Endpoints:</h3>
                <p><strong>GET /api/earnings</strong> - Current earnings data</p>
                <p><strong>GET /api/campaigns</strong> - Active campaigns</p>
                <p><strong>GET /api/automations</strong> - Running automations</p>
                <p><strong>POST /api/webhook</strong> - Affiliate webhooks</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'CashMatic Automation System is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/earnings', (req, res) => {
  res.json(appData.earnings);
});

app.get('/api/campaigns', (req, res) => {
  res.json(appData.campaigns);
});

app.get('/api/automations', (req, res) => {
  res.json(appData.automations);
});

// Webhook endpoint for affiliate tracking
app.post('/api/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  
  // Update earnings based on webhook data
  if (req.body.commission) {
    appData.earnings.daily += parseFloat(req.body.commission);
    appData.earnings.monthly += parseFloat(req.body.commission);
    appData.earnings.total += parseFloat(req.body.commission);
  }
  
  res.json({ 
    success: true, 
    message: 'Webhook processed successfully',
    earnings: appData.earnings
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CashMatic Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Arial', sans-serif; 
                background: #f5f5f5;
                padding: 2rem;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: center;
            }
            .grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 2rem; 
            }
            .card { 
                background: white; 
                padding: 2rem; 
                border-radius: 10px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
            }
            .card h3 { margin-bottom: 1rem; color: #333; }
            .campaign { 
                background: #f8f9fa; 
                padding: 1rem; 
                border-radius: 5px; 
                margin-bottom: 1rem; 
            }
            .status { 
                padding: 0.25rem 0.5rem; 
                border-radius: 15px; 
                font-size: 0.8rem; 
                background: #28a745; 
                color: white; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>💰 CashMatic Dashboard</h1>
            <p>Real-time automation and earnings tracking</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 Earnings Overview</h3>
                <p><strong>Daily:</strong> $${appData.earnings.daily}</p>
                <p><strong>Weekly:</strong> $${appData.earnings.weekly}</p>
                <p><strong>Monthly:</strong> $${appData.earnings.monthly}</p>
                <p><strong>Total:</strong> $${appData.earnings.total}</p>
            </div>
            
            <div class="card">
                <h3>🎯 Active Campaigns</h3>
                ${appData.campaigns.map(campaign => `
                  <div class="campaign">
                    <h4>${campaign.name}</h4>
                    <p>Daily: $${campaign.dailyEarnings}</p>
                    <p>Conversion: ${campaign.conversionRate}%</p>
                    <span class="status">${campaign.status}</span>
                  </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h3>⚡ Automations</h3>
                ${appData.automations.map(automation => `
                  <div class="campaign">
                    <h4>${automation.name}</h4>
                    <p>Status: <span class="status">${automation.status}</span></p>
                    <p>Last Run: ${new Date(automation.lastRun).toLocaleString()}</p>
                  </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
  `);
});

// Automation cron jobs
cron.schedule('0 */6 * * *', () => {
  console.log('Running automated tasks...');
  // Update automation timestamps
  appData.automations.forEach(automation => {
    automation.lastRun = new Date().toISOString();
    automation.nextRun = new Date(Date.now() + 21600000).toISOString(); // 6 hours
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'Visit / for the main page or /dashboard for the control panel'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CashMatic server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
});

module.exports = app;
