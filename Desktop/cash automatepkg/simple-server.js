// Simple server using only built-in Node.js modules
const http = require('http');
const url = require('url');
const path = require('path');

const PORT = process.env.PORT || 3000;

// In-memory storage (replace with database in production)
let appData = {
  earnings: {
    daily: 86.23,
    weekly: 604.61,
    monthly: 2587.45,
    total: 15247.89
  },
  affiliatePrograms: [
    {
      id: 1,
      name: "ClickFunnels PLR Funnels",
      status: "approved", // pending, approved, rejected
      commission: 497,
      commissionType: "per_sale",
      priority: "highest",
      applicationDate: "2025-01-19",
      approvalDate: "2025-01-19",
      affiliateLink: "https://www.plrfunnels.com/plr?aff=df85f82408d6be56fbd3d5189cb62",
      description: "PLR Funnels - High-converting funnel builder with PLR content",
      category: "marketing_tools",
      totalEarnings: 2485.00,
      salesCount: 5,
      conversionRate: 3.2,
      notes: "ACTIVE CAMPAIGN - PLR Funnels with tracking code df85f82408d6be56fbd3d5189cb62"
    },
    {
      id: 2,
      name: "Jasper AI",
      status: "pending",
      commission: 89,
      commissionType: "per_sale",
      priority: "high",
      applicationDate: "2025-01-19",
      affiliateLink: "https://jasper.ai/partners",
      description: "AI writing assistant",
      category: "ai_tools",
      totalEarnings: 0,
      salesCount: 0,
      conversionRate: 0,
      notes: "Usually instant approval"
    },
    {
      id: 3,
      name: "GetResponse",
      status: "pending",
      commission: 120,
      commissionType: "per_sale",
      priority: "medium",
      applicationDate: "2025-01-19",
      affiliateLink: "https://www.getresponse.com/affiliates",
      description: "Email marketing platform",
      category: "email_marketing",
      totalEarnings: 0,
      salesCount: 0,
      conversionRate: 0,
      notes: "24 hour approval time"
    },
    {
      id: 4,
      name: "Teachable",
      status: "pending",
      commission: 450,
      commissionType: "per_sale",
      priority: "high",
      applicationDate: "2025-01-19",
      affiliateLink: "https://teachable.com/affiliates",
      description: "Online course platform",
      category: "education",
      totalEarnings: 0,
      salesCount: 0,
      conversionRate: 0,
      notes: "Manual review required"
    }
  ],
  campaigns: [
    {
      id: 1,
      name: "ClickFunnels Affiliate Campaign",
      type: "affiliate",
      status: "active",
      dailyEarnings: 45.32,
      conversionRate: 3.2,
      nextAction: "Post scheduled in 2 hours",
      primaryAffiliate: "ClickFunnels",
      affiliateLinks: [
        { tool: "ClickFunnels PLR", commission: 497, link: "https://www.plrfunnels.com/plr?aff=df85f82408d6be56fbd3d5189cb62", priority: "highest" },
        { tool: "Jasper AI", commission: 89, link: "https://jasper.ai/partners", priority: "high" },
        { tool: "GetResponse", commission: 120, link: "https://www.getresponse.com/affiliates", priority: "medium" }
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
      platforms: ["WordPress", "Medium", "LinkedIn"],
      primaryAffiliate: "Jasper AI",
      affiliateLinks: [
        { tool: "Jasper AI", commission: 89, link: "https://jasper.ai/partners", priority: "high" },
        { tool: "GetResponse", commission: 120, link: "https://www.getresponse.com/affiliates", priority: "medium" }
      ]
    },
    {
      id: 3,
      name: "Social Media Automation",
      type: "social",
      status: "active",
      dailyEarnings: 12.15,
      conversionRate: 1.9,
      nextAction: "Engagement round in 30 mins",
      platforms: ["Twitter", "LinkedIn", "Instagram"],
      primaryAffiliate: "Multiple",
      affiliateLinks: [
        { tool: "ClickFunnels PLR", commission: 497, link: "https://www.plrfunnels.com/plr?aff=df85f82408d6be56fbd3d5189cb62", priority: "highest" },
        { tool: "Teachable", commission: 450, link: "https://teachable.com/affiliates", priority: "high" }
      ]
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
    dailyGoal: 75
  }
};

// Simple HTML dashboard
const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passive Income Automation Tool</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-value { font-size: 2em; font-weight: bold; color: #667eea; }
        .campaigns { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .campaign { border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .status-active { border-left: 4px solid #4CAF50; }
        .btn { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #5a6fd8; }
        .btn-success { background: #28a745; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn-danger { background: #dc3545; }
        .automation-status { padding: 10px; border-radius: 5px; margin: 10px 0; }
        .running { background: #d4edda; color: #155724; }
        .paused { background: #f8d7da; color: #721c24; }
        .affiliate-program { border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .status-approved { border-left: 4px solid #28a745; }
        .status-pending { border-left: 4px solid #ffc107; }
        .status-rejected { border-left: 4px solid #dc3545; }
        .priority-highest { background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; }
        .priority-high { background: linear-gradient(135deg, #48cae4, #0077b6); color: white; }
        .priority-medium { background: linear-gradient(135deg, #a8dadc, #457b9d); color: white; }
        .commission-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; margin: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Passive Income Automation Tool</h1>
            <p>AI-powered dashboard generating daily passive income</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>Daily Earnings</h3>
                <div class="stat-value">$${appData.earnings.daily.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Weekly Earnings</h3>
                <div class="stat-value">$${appData.earnings.weekly.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Monthly Earnings</h3>
                <div class="stat-value">$${appData.earnings.monthly.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Total Earnings</h3>
                <div class="stat-value">$${appData.earnings.total.toFixed(2)}</div>
            </div>
        </div>

        <div class="automation-status ${appData.settings.automationEnabled ? 'running' : 'paused'}">
            <strong>Automation Status:</strong> ${appData.settings.automationEnabled ? '🟢 RUNNING' : '🔴 PAUSED'}
            <button class="btn" onclick="toggleAutomation()">
                ${appData.settings.automationEnabled ? 'Pause' : 'Resume'} Automation
            </button>
        </div>

        <div class="campaigns">
            <h2>🔗 Affiliate Programs Status</h2>
            ${appData.affiliatePrograms.map(program => `
                <div class="affiliate-program status-${program.status}">
                    <h3>${program.name}
                        <span class="commission-badge priority-${program.priority}">
                            $${program.commission} ${program.commissionType.replace('_', ' ')}
                        </span>
                    </h3>
                    <p><strong>Status:</strong>
                        <span style="color: ${program.status === 'approved' ? '#28a745' : program.status === 'pending' ? '#ffc107' : '#dc3545'}">
                            ${program.status.toUpperCase()}
                        </span>
                    </p>
                    <p><strong>Category:</strong> ${program.category.replace('_', ' ')}</p>
                    <p><strong>Total Earnings:</strong> $${program.totalEarnings.toFixed(2)}</p>
                    <p><strong>Sales Count:</strong> ${program.salesCount}</p>
                    <p><strong>Application Date:</strong> ${program.applicationDate}</p>
                    ${program.approvalDate ? `<p><strong>Approval Date:</strong> ${program.approvalDate}</p>` : ''}
                    <p><strong>Notes:</strong> ${program.notes}</p>
                    <div style="margin-top: 10px;">
                        <a href="${program.affiliateLink}" target="_blank" class="btn btn-success">
                            ${program.status === 'approved' ? 'View Dashboard' : 'Apply Now'}
                        </a>
                        ${program.status === 'approved' ? `
                            <button class="btn" onclick="copyAffiliateLink('${program.affiliateLink}')">Copy Link</button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="campaigns">
            <h2>📈 Active Campaigns</h2>
            ${appData.campaigns.map(campaign => `
                <div class="campaign status-active">
                    <h3>${campaign.name}</h3>
                    <p><strong>Type:</strong> ${campaign.type}</p>
                    <p><strong>Primary Affiliate:</strong> ${campaign.primaryAffiliate || 'Multiple'}</p>
                    <p><strong>Daily Earnings:</strong> $${campaign.dailyEarnings}</p>
                    <p><strong>Conversion Rate:</strong> ${campaign.conversionRate}%</p>
                    <p><strong>Next Action:</strong> ${campaign.nextAction}</p>
                    <div style="margin-top: 10px;">
                        <strong>Affiliate Links:</strong>
                        ${campaign.affiliateLinks.map(link => `
                            <div style="margin: 5px 0;">
                                <span class="commission-badge priority-${link.priority}">
                                    ${link.tool}: $${link.commission}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="campaigns">
            <h2>Content Queue</h2>
            ${appData.contentQueue.map(content => `
                <div class="campaign">
                    <h3>${content.title}</h3>
                    <p><strong>Platform:</strong> ${content.platform}</p>
                    <p><strong>Status:</strong> ${content.status}</p>
                    <p><strong>Estimated Earnings:</strong> $${content.estimatedEarnings}</p>
                    <p><strong>Scheduled:</strong> ${new Date(content.scheduledFor).toLocaleString()}</p>
                </div>
            `).join('')}
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <button class="btn" onclick="generateContent()">🤖 Generate New Content</button>
            <button class="btn" onclick="setupCampaign()">📈 Setup New Campaign</button>
            <button class="btn" onclick="viewAnalytics()">📊 View Analytics</button>
            <button class="btn btn-success" onclick="addAffiliateProgram()">🔗 Add Affiliate Program</button>
            <button class="btn btn-warning" onclick="updateAffiliateStatus()">✅ Update Status</button>
        </div>
    </div>

    <script>
        function toggleAutomation() {
            fetch('/api/toggle-automation', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                });
        }

        function generateContent() {
            const topic = prompt('Enter content topic:') || 'AI Tools for Passive Income';
            fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, platform: 'Blog', type: 'article' })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
        }

        function setupCampaign() {
            const type = prompt('Campaign type (affiliate/content/social):') || 'affiliate';
            fetch('/api/setup-campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, config: {} })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
        }

        function viewAnalytics() {
            window.open('/api/analytics', '_blank');
        }

        function copyAffiliateLink(link) {
            navigator.clipboard.writeText(link).then(() => {
                alert('Affiliate link copied to clipboard!');
            });
        }

        function addAffiliateProgram() {
            const name = prompt('Affiliate Program Name:');
            const commission = prompt('Commission Amount ($):');
            const link = prompt('Affiliate Link:');

            if (name && commission && link) {
                fetch('/api/affiliate-programs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        commission: parseFloat(commission),
                        affiliateLink: link,
                        status: 'pending'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                });
            }
        }

        function updateAffiliateStatus() {
            const programId = prompt('Program ID to update:');
            const status = prompt('New status (pending/approved/rejected):');

            if (programId && status) {
                fetch('/api/affiliate-programs/' + programId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                });
            }
        }

        // Auto-refresh every 30 seconds
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>
`;

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(dashboardHTML);
  } else if (pathname === '/api/dashboard') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      earnings: appData.earnings,
      campaigns: appData.campaigns,
      contentQueue: appData.contentQueue,
      automationStatus: appData.settings.automationEnabled ? 'running' : 'paused'
    }));
  } else if (pathname === '/api/toggle-automation' && req.method === 'POST') {
    appData.settings.automationEnabled = !appData.settings.automationEnabled;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: appData.settings.automationEnabled ? 'running' : 'paused',
      message: `Automation ${appData.settings.automationEnabled ? 'resumed' : 'paused'}`
    }));
  } else if (pathname === '/api/generate-content' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { topic, platform, type } = JSON.parse(body || '{}');
      const newContent = {
        id: Date.now(),
        title: `AI-Generated: ${topic || 'Best Passive Income Strategies for 2025'}`,
        platform: platform || 'Blog',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(),
        status: 'ready',
        estimatedEarnings: Math.floor(Math.random() * 40) + 20,
        content: `Generated content for ${topic}...`,
        type: type || 'article'
      };
      appData.contentQueue.push(newContent);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        content: newContent,
        message: 'Content generated successfully'
      }));
    });
  } else if (pathname === '/api/analytics') {
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
      affiliateStats: {
        totalPrograms: appData.affiliatePrograms.length,
        approvedPrograms: appData.affiliatePrograms.filter(p => p.status === 'approved').length,
        pendingPrograms: appData.affiliatePrograms.filter(p => p.status === 'pending').length,
        totalAffiliateEarnings: appData.affiliatePrograms.reduce((sum, p) => sum + p.totalEarnings, 0),
        topPerformer: appData.affiliatePrograms.reduce((top, current) =>
          current.totalEarnings > (top?.totalEarnings || 0) ? current : top, null)
      }
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics));
  } else if (pathname === '/api/affiliate-programs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(appData.affiliatePrograms));
  } else if (pathname === '/api/affiliate-programs' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { name, commission, affiliateLink, status } = JSON.parse(body || '{}');
      const newProgram = {
        id: Date.now(),
        name,
        commission,
        affiliateLink,
        status: status || 'pending',
        commissionType: 'per_sale',
        priority: 'medium',
        applicationDate: new Date().toISOString().split('T')[0],
        category: 'general',
        totalEarnings: 0,
        salesCount: 0,
        conversionRate: 0,
        notes: 'Added manually'
      };
      appData.affiliatePrograms.push(newProgram);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        program: newProgram,
        message: 'Affiliate program added successfully'
      }));
    });
  } else if (pathname.startsWith('/api/affiliate-programs/') && req.method === 'PUT') {
    const programId = parseInt(pathname.split('/')[3]);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const updates = JSON.parse(body || '{}');
      const programIndex = appData.affiliatePrograms.findIndex(p => p.id === programId);
      if (programIndex !== -1) {
        appData.affiliatePrograms[programIndex] = { ...appData.affiliatePrograms[programIndex], ...updates };
        if (updates.status === 'approved' && !appData.affiliatePrograms[programIndex].approvalDate) {
          appData.affiliatePrograms[programIndex].approvalDate = new Date().toISOString().split('T')[0];
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          program: appData.affiliatePrograms[programIndex],
          message: 'Affiliate program updated successfully'
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Program not found' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Simulate earnings updates every 5 minutes
setInterval(() => {
  if (appData.settings.automationEnabled) {
    const increment = Math.random() * 2;
    appData.earnings.daily += increment;
    appData.earnings.weekly += increment;
    appData.earnings.monthly += increment;
    appData.earnings.total += increment;
    console.log(`[${new Date().toISOString()}] Earnings updated: +$${increment.toFixed(2)}`);
  }
}, 5 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`🚀 Passive Income Automation Tool running on port ${PORT}`);
  console.log(`💰 Dashboard: http://localhost:${PORT}`);
  console.log(`🤖 Automation: ${appData.settings.automationEnabled ? 'ENABLED' : 'DISABLED'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});
