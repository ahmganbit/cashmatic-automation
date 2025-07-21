# 🚀 CashMatic - Automated Income System

A powerful automation platform for entrepreneurs to build and manage passive income streams through affiliate marketing and business automation.

## 🌟 Features

- **Real-time Earnings Tracking** - Monitor daily, weekly, and monthly revenue
- **Campaign Management** - Track multiple affiliate campaigns
- **Automation Engine** - Automated email sequences and social posting
- **Webhook Integration** - Real-time commission tracking
- **Professional Dashboard** - Clean, responsive interface
- **API Endpoints** - Full REST API for integrations

## 🚀 Quick Start

### Deploy to Render (Free)

1. **Fork this repository**
2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Environment:** Node

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy!** Your app will be live at `https://your-app-name.onrender.com`

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:10000
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main landing page |
| `/dashboard` | GET | Admin dashboard |
| `/api/status` | GET | System status |
| `/api/earnings` | GET | Current earnings data |
| `/api/campaigns` | GET | Active campaigns |
| `/api/automations` | GET | Running automations |
| `/api/webhook` | POST | Affiliate commission webhooks |
| `/health` | GET | Health check |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=your_database_url
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_secret_key
```

### Affiliate Integration

Add your affiliate API keys to environment variables:
- `CLICKFUNNELS_API_KEY`
- `GETRESPONSE_API_KEY`
- `SEMRUSH_API_KEY`
- `LIQUID_WEB_API_KEY`

## 💰 Supported Affiliate Programs

- **ClickFunnels** - Up to $497/sale
- **GetResponse** - $120/month recurring
- **Semrush** - $200/month recurring
- **Liquid Web** - Up to $7,000/sale
- **Authority Hacker** - $1,500/sale
- **Teachable** - $450/month recurring

## 🔄 Automation Features

- **Email Sequences** - Automated nurture campaigns
- **Social Media** - Scheduled posting across platforms
- **Content Generation** - AI-powered content creation
- **Lead Tracking** - Real-time conversion monitoring
- **Commission Tracking** - Automatic earnings updates

## 📈 Scaling Options

### Free Tier (Render)
- Perfect for getting started
- 512MB RAM, shared CPU
- Automatic SSL
- Custom domain support

### Upgrade Path
- **Render Pro:** $7/month - More resources
- **VPS:** $20-50/month - Full control
- **Dedicated:** $100+/month - Maximum performance

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (optional)
- **Hosting:** Render (free tier)
- **Automation:** Node-cron
- **Security:** Helmet + CORS
- **Monitoring:** Built-in health checks

## 📞 Support

- **Documentation:** [GitHub Wiki](https://github.com/cashmatic/automation-system/wiki)
- **Issues:** [GitHub Issues](https://github.com/cashmatic/automation-system/issues)
- **Email:** support@cashmatic.com

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**🚀 Built for entrepreneurs who want to automate their income and scale their business.**
