// AUTOMATED EMAIL MARKETING SYSTEM
// Converts leads to sales automatically

class EmailAutomationSystem {
  constructor() {
    this.emailSequences = this.initializeEmailSequences();
    this.subscribers = [];
    this.emailStats = {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    };
  }

  initializeEmailSequences() {
    return {
      // Welcome sequence for new subscribers
      welcome: [
        {
          day: 0,
          subject: "🎯 Welcome! Your $497 bonus is inside...",
          template: "welcome_bonus",
          cta: "Get ClickFunnels FREE Trial",
          affiliate: "ClickFunnels"
        },
        {
          day: 1,
          subject: "💰 How I made $1,247 yesterday (proof inside)",
          template: "income_proof",
          cta: "Start Your Journey",
          affiliate: "ClickFunnels"
        },
        {
          day: 2,
          subject: "🚨 The #1 mistake that kills 90% of beginners",
          template: "common_mistakes",
          cta: "Avoid This Mistake",
          affiliate: "Jasper AI"
        },
        {
          day: 3,
          subject: "📊 Case Study: $0 to $10,000 in 30 days",
          template: "case_study",
          cta: "See The System",
          affiliate: "ClickFunnels"
        },
        {
          day: 5,
          subject: "⏰ Last chance: Special 50% off expires tonight",
          template: "urgency_offer",
          cta: "Claim 50% Discount",
          affiliate: "ClickFunnels"
        },
        {
          day: 7,
          subject: "🔥 Final reminder: Don't miss this opportunity",
          template: "final_reminder",
          cta: "Last Chance Offer",
          affiliate: "ClickFunnels"
        }
      ],

      // High-value content sequence
      content: [
        {
          day: 0,
          subject: "🎓 Free Training: Build Your First Funnel in 10 Minutes",
          template: "training_content",
          cta: "Watch Free Training",
          affiliate: "ClickFunnels"
        },
        {
          day: 2,
          subject: "✍️ AI writes your sales copy in 30 seconds",
          template: "ai_copywriting",
          cta: "Try AI Writing",
          affiliate: "Jasper AI"
        },
        {
          day: 4,
          subject: "📧 Email automation that made me $50k",
          template: "email_automation",
          cta: "Get Email System",
          affiliate: "GetResponse"
        },
        {
          day: 6,
          subject: "🎯 Turn your knowledge into $10k/month",
          template: "course_creation",
          cta: "Create Your Course",
          affiliate: "Teachable"
        }
      ],

      // Re-engagement sequence for inactive subscribers
      reengagement: [
        {
          day: 0,
          subject: "😢 I miss you... (special comeback offer inside)",
          template: "miss_you",
          cta: "Come Back Special",
          affiliate: "ClickFunnels"
        },
        {
          day: 3,
          subject: "🎁 Here's a gift to win you back",
          template: "comeback_gift",
          cta: "Claim Your Gift",
          affiliate: "Jasper AI"
        },
        {
          day: 7,
          subject: "💔 This is goodbye... (unless you want this)",
          template: "final_goodbye",
          cta: "Don't Leave Yet",
          affiliate: "ClickFunnels"
        }
      ]
    };
  }

  // Email templates with high-converting copy
  getEmailTemplate(templateName, data) {
    const templates = {
      welcome_bonus: `
Hi ${data.firstName || 'Friend'},

Welcome to the inner circle! 🎉

I'm excited to have you here because I'm about to share something that changed my life completely.

Just 6 months ago, I was struggling to make ends meet. Today, I'm consistently earning $500-$1,000+ per day using a simple system.

🎯 HERE'S YOUR EXCLUSIVE BONUS:

✅ My Complete ClickFunnels Blueprint ($497 value)
✅ 50+ High-Converting Funnel Templates
✅ Step-by-Step Video Training Series
✅ Private Facebook Group Access
✅ 1-on-1 Setup Call (Limited Time)

But here's the thing - this bonus is only available for the next 24 hours.

${data.cta}: ${data.affiliateLink}

Talk soon,
[Your Name]

P.S. Over 10,000 people are already using this system. Don't get left behind.
`,

      income_proof: `
Subject: 💰 How I made $1,247 yesterday (proof inside)

${data.firstName || 'Hey there'},

I had to share this with you immediately...

Yesterday was INSANE. Check out this screenshot from my dashboard:

[INCOME SCREENSHOT - $1,247.83]

And the crazy part? This was all automated.

While I was sleeping, having dinner with family, even watching Netflix - the money kept rolling in.

Here's exactly what happened:

🔥 7:23 AM - $497 commission (ClickFunnels sale)
🔥 11:45 AM - $89 commission (Jasper AI sale)  
🔥 2:17 PM - $450 commission (Teachable sale)
🔥 6:33 PM - $120 commission (GetResponse sale)
🔥 9:51 PM - $91.83 (Multiple smaller sales)

Total: $1,247.83 in ONE DAY.

The system that made this possible is called ClickFunnels, and right now you can get it for FREE.

${data.cta}: ${data.affiliateLink}

This isn't some get-rich-quick scheme. It's a proven system used by over 100,000 entrepreneurs.

But the free trial ends soon, so don't wait.

Your success story starts today,
[Your Name]

P.S. I'm so confident this will work for you, I'm including my personal cell number for support: [PHONE]
`,

      case_study: `
Subject: 📊 Case Study: $0 to $10,000 in 30 days

${data.firstName || 'Friend'},

I want to share Sarah's story with you...

30 days ago, Sarah was a complete beginner. Zero experience with online business.

Today? She just hit $10,000 in her first month.

Here's her exact journey:

📅 DAY 1-3: Set up her first funnel using ClickFunnels
📅 DAY 4-7: Created her lead magnet and email sequence  
📅 DAY 8-14: Started driving traffic (I showed her my secret method)
📅 DAY 15-21: First sales started coming in ($1,200 week)
📅 DAY 22-30: Scaled to $10,000+ total

"I can't believe how simple this actually is. The system literally runs itself now!" - Sarah M.

The best part? Sarah is using the EXACT same system I'm offering you.

${data.cta}: ${data.affiliateLink}

But here's what Sarah wishes she knew earlier:

❌ DON'T try to build everything from scratch
❌ DON'T waste time on complicated tech
❌ DON'T try to figure it out alone

✅ DO use proven templates (included)
✅ DO follow the step-by-step system
✅ DO get started TODAY

Your 30-day transformation starts now,
[Your Name]

P.S. Sarah's results aren't typical, but they're possible when you follow the system exactly.
`,

      urgency_offer: `
Subject: ⏰ Last chance: Special 50% off expires tonight

${data.firstName || 'Hey'},

This is it. Your last chance.

In exactly 6 hours and 23 minutes, this special 50% discount disappears forever.

After tonight, you'll pay full price ($297/month) instead of the special rate ($147/month).

That's an extra $150/month... or $1,800/year.

But more importantly, you'll miss out on the system that's already changed thousands of lives.

Here's what you get when you join TODAY:

✅ Complete ClickFunnels System (normally $297/month)
✅ My Personal Templates ($497 value)
✅ Step-by-Step Training ($997 value)  
✅ Private Mastermind Access ($197/month value)
✅ 1-on-1 Setup Call ($497 value)
✅ 30-Day Money-Back Guarantee

Total Value: $2,485
Your Price Today: $147/month (50% off)

${data.cta}: ${data.affiliateLink}

Don't let this opportunity slip away.

The timer is ticking,
[Your Name]

P.S. After midnight tonight, this offer is gone forever. No exceptions.

⏰ TIMER: 6 hours, 23 minutes remaining
`,

      final_reminder: `
Subject: 🔥 Final reminder: Don't miss this opportunity

${data.firstName || 'Friend'},

This is my final email about this opportunity.

In 2 hours, the doors close on the most powerful business system I've ever seen.

I've sent you several emails about this because I genuinely believe it can change your life.

But I can't want your success more than you do.

If you're serious about:
• Making $500-$1,000+ per day
• Building a real online business  
• Creating financial freedom for your family
• Working from anywhere in the world

Then this is your moment.

${data.cta}: ${data.affiliateLink}

After tonight, you'll have to wait 6 months for the next opportunity.

Don't let "someday" become never.

This is your time,
[Your Name]

P.S. I believe in you. Now it's time to believe in yourself.

⏰ 2 hours remaining
`
    };

    return templates[templateName] || templates.welcome_bonus;
  }

  // Add subscriber and start email sequence
  addSubscriber(email, firstName = '', source = '', affiliate = 'ClickFunnels') {
    const subscriber = {
      id: Date.now(),
      email,
      firstName,
      source,
      affiliate,
      subscribeDate: new Date(),
      status: 'active',
      sequenceType: 'welcome',
      emailsSent: 0,
      opened: 0,
      clicked: 0,
      converted: false
    };

    this.subscribers.push(subscriber);
    this.startEmailSequence(subscriber);
    
    console.log(`📧 New subscriber added: ${email} (Source: ${source})`);
    return subscriber;
  }

  // Start automated email sequence
  startEmailSequence(subscriber) {
    const sequence = this.emailSequences[subscriber.sequenceType];
    
    sequence.forEach((email, index) => {
      setTimeout(() => {
        this.sendEmail(subscriber, email);
      }, email.day * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    });
  }

  // Send individual email
  async sendEmail(subscriber, emailData) {
    if (subscriber.status !== 'active') return;

    const affiliateLinks = {
      'ClickFunnels': 'https://www.clickfunnels.com/affiliates?ref=YOUR_ID',
      'Jasper AI': 'https://jasper.ai/partners?ref=YOUR_ID',
      'GetResponse': 'https://www.getresponse.com/affiliates?ref=YOUR_ID',
      'Teachable': 'https://teachable.com/affiliates?ref=YOUR_ID'
    };

    const emailContent = this.getEmailTemplate(emailData.template, {
      firstName: subscriber.firstName,
      cta: emailData.cta,
      affiliateLink: affiliateLinks[emailData.affiliate]
    });

    // Simulate email sending (in real implementation, use email service)
    console.log(`📧 Sending email to ${subscriber.email}: ${emailData.subject}`);
    
    // Update stats
    this.emailStats.sent++;
    subscriber.emailsSent++;

    // Simulate open and click rates
    setTimeout(() => {
      if (Math.random() < 0.25) { // 25% open rate
        this.emailStats.opened++;
        subscriber.opened++;
        console.log(`👀 ${subscriber.email} opened: ${emailData.subject}`);

        if (Math.random() < 0.15) { // 15% click rate of opens
          this.emailStats.clicked++;
          subscriber.clicked++;
          console.log(`🖱️ ${subscriber.email} clicked: ${emailData.cta}`);

          if (Math.random() < 0.08) { // 8% conversion rate of clicks
            this.emailStats.converted++;
            subscriber.converted = true;
            console.log(`💰 CONVERSION! ${subscriber.email} purchased via ${emailData.affiliate}`);
            
            // Trigger sale in main system
            this.triggerSale(emailData.affiliate, subscriber);
          }
        }
      }
    }, Math.random() * 3600000); // Random delay up to 1 hour
  }

  // Trigger sale in main system
  triggerSale(affiliate, subscriber) {
    const commissions = {
      'ClickFunnels': 497,
      'Jasper AI': 89,
      'GetResponse': 120,
      'Teachable': 450
    };

    const commission = commissions[affiliate];
    
    // In real implementation, this would integrate with the main sales tracking system
    console.log(`🎉 SALE TRIGGERED: $${commission} from ${affiliate} via email to ${subscriber.email}`);
    
    // Move subscriber to customer sequence
    subscriber.sequenceType = 'customer';
    this.startCustomerSequence(subscriber);
  }

  // Customer nurture sequence (upsells, cross-sells)
  startCustomerSequence(subscriber) {
    const customerEmails = [
      {
        day: 1,
        subject: "🎉 Welcome to the success club! Here's your next step...",
        template: "customer_welcome"
      },
      {
        day: 3,
        subject: "🚀 Ready to 10x your results? (Advanced training inside)",
        template: "upsell_advanced"
      },
      {
        day: 7,
        subject: "💎 Exclusive: Join our $10k/month mastermind",
        template: "mastermind_invite"
      }
    ];

    customerEmails.forEach(email => {
      setTimeout(() => {
        this.sendEmail(subscriber, email);
      }, email.day * 24 * 60 * 60 * 1000);
    });
  }

  // Re-engage inactive subscribers
  reengageInactiveSubscribers() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const inactiveSubscribers = this.subscribers.filter(sub => 
      sub.status === 'active' && 
      sub.subscribeDate < thirtyDaysAgo && 
      sub.opened === 0
    );

    inactiveSubscribers.forEach(subscriber => {
      subscriber.sequenceType = 'reengagement';
      this.startEmailSequence(subscriber);
      console.log(`🔄 Re-engaging inactive subscriber: ${subscriber.email}`);
    });
  }

  // Get email marketing stats
  getStats() {
    const totalSubscribers = this.subscribers.length;
    const activeSubscribers = this.subscribers.filter(s => s.status === 'active').length;
    const openRate = this.emailStats.sent > 0 ? (this.emailStats.opened / this.emailStats.sent * 100).toFixed(1) : 0;
    const clickRate = this.emailStats.opened > 0 ? (this.emailStats.clicked / this.emailStats.opened * 100).toFixed(1) : 0;
    const conversionRate = this.emailStats.clicked > 0 ? (this.emailStats.converted / this.emailStats.clicked * 100).toFixed(1) : 0;

    return {
      totalSubscribers,
      activeSubscribers,
      emailsSent: this.emailStats.sent,
      openRate: `${openRate}%`,
      clickRate: `${clickRate}%`,
      conversionRate: `${conversionRate}%`,
      totalConversions: this.emailStats.converted,
      estimatedRevenue: this.emailStats.converted * 350 // Average commission
    };
  }

  // Start automated email marketing
  startAutomation() {
    console.log('📧 Email Automation System Started');
    
    // Re-engage inactive subscribers daily
    setInterval(() => {
      this.reengageInactiveSubscribers();
    }, 24 * 60 * 60 * 1000); // Daily

    // Clean up bounced emails weekly
    setInterval(() => {
      this.cleanupBouncedEmails();
    }, 7 * 24 * 60 * 60 * 1000); // Weekly
  }

  cleanupBouncedEmails() {
    // Remove subscribers who haven't engaged in 60 days
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    
    this.subscribers = this.subscribers.filter(sub => {
      if (sub.subscribeDate < sixtyDaysAgo && sub.opened === 0) {
        console.log(`🗑️ Removing inactive subscriber: ${sub.email}`);
        return false;
      }
      return true;
    });
  }
}

// Export for use in main system
module.exports = EmailAutomationSystem;

// Example usage:
if (require.main === module) {
  const emailSystem = new EmailAutomationSystem();
  emailSystem.startAutomation();
  
  // Simulate adding subscribers
  emailSystem.addSubscriber('test@example.com', 'John', 'YouTube Video', 'ClickFunnels');
  emailSystem.addSubscriber('test2@example.com', 'Sarah', 'Blog Post', 'Jasper AI');
  
  console.log('📊 Email Stats:', emailSystem.getStats());
}
