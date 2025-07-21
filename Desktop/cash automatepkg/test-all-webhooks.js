// Test all platform webhooks automatically
const testAllWebhooks = async () => {
  const webhooks = {
    youtube: "https://hooks.zapier.com/hooks/catch/23844949/youtube/",
    tiktok: "https://hooks.zapier.com/hooks/catch/23844949/tiktok/",
    instagram: "https://hooks.zapier.com/hooks/catch/23844949/instagram/",
    facebook: "https://hooks.zapier.com/hooks/catch/23844949/facebook/",
    twitter: "https://hooks.zapier.com/hooks/catch/23844949/twitter/",
    linkedin: "https://hooks.zapier.com/hooks/catch/23844949/linkedin/",
    pinterest: "https://hooks.zapier.com/hooks/catch/23844949/pinterest/",
    medium: "https://hooks.zapier.com/hooks/catch/23844949/medium/",
    wordpress: "https://hooks.zapier.com/hooks/catch/23844949/wordpress/",
    reddit: "https://hooks.zapier.com/hooks/catch/23844949/reddit/",
    quora: "https://hooks.zapier.com/hooks/catch/23844949/quora/",
    telegram: "https://hooks.zapier.com/hooks/catch/23844949/telegram/",
    discord: "https://hooks.zapier.com/hooks/catch/23844949/discord/",
    twitch: "https://hooks.zapier.com/hooks/catch/23844949/twitch/",
    spotify: "https://hooks.zapier.com/hooks/catch/23844949/spotify/",
    snapchat: "https://hooks.zapier.com/hooks/catch/23844949/snapchat/",
    youtubeshorts: "https://hooks.zapier.com/hooks/catch/23844949/youtubeshorts/"
  };

  const testData = {
    title: "How I Make $500/Day with Automated Affiliate Marketing",
    description: `My complete system for generating passive income through affiliate marketing automation. 

🎯 What you'll learn:
✅ Complete automation setup
✅ High-converting affiliate programs  
✅ Multi-platform content strategy
✅ Email marketing sequences
✅ Performance optimization

💰 My results:
Month 1: $2,347
Month 2: $5,891
Month 3: $8,234
Current: $15,000+/month

No experience needed - everything is automated!`,
    
    full_article_content: `# How I Make $500/Day with Automated Affiliate Marketing

## Introduction
After struggling for years to make money online, I finally cracked the code. The secret isn't working harder - it's working smarter through automation.

## My Story
Six months ago, I was barely making ends meet. Today, I consistently earn $500-$1,000+ per day through a completely automated system.

## The System
Here's exactly how it works:

### 1. High-Commission Affiliate Programs
I focus on programs that pay $100-$500 per sale:
- ClickFunnels: $497 per sale
- Teachable: $450 per sale  
- GetResponse: $120 per sale
- Jasper AI: $89 per sale

### 2. Automated Content Creation
AI generates all my content:
- Blog posts (2,000+ words)
- Social media posts
- Email sequences
- Video scripts

### 3. Multi-Platform Publishing
Content automatically posts to:
- YouTube, TikTok, Instagram
- Twitter, LinkedIn, Facebook
- Pinterest, Medium, WordPress
- Reddit, Quora, Telegram

### 4. Email Marketing Automation
Automated sequences convert leads:
- Welcome series (7 emails)
- Nurture sequence (14 emails)
- Sales sequence (5 emails)
- Re-engagement (3 emails)

### 5. Performance Optimization
System automatically:
- A/B tests content
- Optimizes posting times
- Focuses on best performers
- Scales successful campaigns

## Results Timeline
- Week 1: System setup, first leads
- Week 2: First $500-1,000 in sales
- Month 1: $2,000-5,000 monthly
- Month 3: $5,000-10,000 monthly
- Month 6: $10,000+ monthly

## Getting Started
The tools that made this possible:
[Affiliate links would go here]

## Conclusion
This isn't about get-rich-quick schemes. It's about building systems that work 24/7.

The automation handles everything while you focus on what matters most.

Your financial freedom journey starts today.`,

    affiliate_links: `🔗 ClickFunnels: https://www.clickfunnels.com/affiliates?ref=YOUR_ID ($497/sale)
🔗 Jasper AI: https://jasper.ai/partners?ref=YOUR_ID ($89/sale)  
🔗 GetResponse: https://www.getresponse.com/affiliates?ref=YOUR_ID ($120/sale)
🔗 Teachable: https://teachable.com/affiliates?ref=YOUR_ID ($450/sale)`,

    main_affiliate_link: "https://www.clickfunnels.com/affiliates?ref=YOUR_ID",
    clickfunnels_link: "https://www.clickfunnels.com/affiliates?ref=YOUR_ID",
    jasper_link: "https://jasper.ai/partners?ref=YOUR_ID",
    getresponse_link: "https://www.getresponse.com/affiliates?ref=YOUR_ID",
    teachable_link: "https://teachable.com/affiliates?ref=YOUR_ID",
    
    image_url: "https://via.placeholder.com/1200x630/4CAF50/FFFFFF?text=Passive+Income+System",
    video_url: "https://example.com/automated-affiliate-marketing-video.mp4",
    audio_url: "https://example.com/passive-income-podcast.mp3",
    short_video_url: "https://example.com/affiliate-marketing-short.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/DC2626/FFFFFF?text=Make+Money+Online",
    
    tags: "passive income,affiliate marketing,make money online,automation,side hustle,financial freedom",
    category: "Education",
    privacy: "public",
    
    step_by_step_breakdown: `Step 1: Choose high-commission affiliate programs
Step 2: Set up automation tools  
Step 3: Create content templates
Step 4: Configure multi-platform posting
Step 5: Build email sequences
Step 6: Launch and optimize`,

    results_timeline: `Week 1: Setup and first leads captured
Week 2: First $500-1,000 in commissions
Month 1: $2,000-5,000 monthly revenue  
Month 3: $5,000-10,000 monthly revenue
Month 6: $10,000+ monthly recurring`,

    email_subject: "🚀 How I automated my way to $500/day",
    email_content: "I just shared my complete automation system that generates $500+ daily...",
    email_ps: "This system works even while you sleep!",
    
    subscriber_email: "test@example.com",
    first_name: "Friend",
    unsubscribe_link: "https://example.com/unsubscribe",
    
    timestamp: new Date().toISOString(),
    platform: "multi-platform",
    content_type: "automation_system",
    commission_total: 1156, // Sum of all affiliate commissions
    conversion_rate: 3.2,
    traffic_sources: "organic,social,email,paid"
  };

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🚀 TESTING ALL WEBHOOK INTEGRATIONS                      ║
║                                                              ║
║    Testing ${Object.keys(webhooks).length} platform automations...                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  const results = {
    successful: [],
    failed: [],
    total: Object.keys(webhooks).length
  };

  for (const [platform, url] of Object.entries(webhooks)) {
    try {
      console.log(`🔄 Testing ${platform.toUpperCase()}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'AutomatedSalesMachine/1.0'
        },
        body: JSON.stringify({
          ...testData,
          platform: platform,
          test_mode: true,
          webhook_test: true
        })
      });
      
      if (response.ok) {
        console.log(`  ✅ ${platform.toUpperCase()}: Webhook successful (${response.status})`);
        results.successful.push(platform);
      } else {
        console.log(`  ❌ ${platform.toUpperCase()}: Webhook failed (${response.status})`);
        results.failed.push(platform);
      }
    } catch (error) {
      console.log(`  ❌ ${platform.toUpperCase()}: Connection error - ${error.message}`);
      results.failed.push(platform);
    }
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    📊 WEBHOOK TESTING RESULTS                               ║
║                                                              ║
║    ✅ Successful: ${results.successful.length.toString().padStart(2)}/${results.total}                                    ║
║    ❌ Failed: ${results.failed.length.toString().padStart(6)}/${results.total}                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  if (results.successful.length > 0) {
    console.log('\n🎉 WORKING PLATFORMS:');
    results.successful.forEach(platform => {
      console.log(`  ✅ ${platform.toUpperCase()} - Ready for automation`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n⚠️  PLATFORMS NEEDING SETUP:');
    results.failed.forEach(platform => {
      console.log(`  ❌ ${platform.toUpperCase()} - Create Zapier automation`);
    });
    
    console.log('\n🔧 SETUP INSTRUCTIONS:');
    console.log('1. Go to zapier.com and create new Zaps');
    console.log('2. Use "Webhooks by Zapier" as trigger');
    console.log('3. Copy field mappings from zapier-automation-templates.md');
    console.log('4. Test each automation individually');
    console.log('5. Re-run this test script');
  }

  console.log('\n🚀 NEXT STEPS:');
  if (results.successful.length >= 5) {
    console.log('✅ You have enough platforms to start earning!');
    console.log('✅ Run: node launch-money-machine.js');
    console.log('✅ Your automation will start posting immediately');
  } else {
    console.log('⚠️  Set up at least 5 platforms for optimal results');
    console.log('📝 Use the templates in zapier-automation-templates.md');
    console.log('🔄 Re-run this test when ready');
  }

  return results;
};

// Export for use in other scripts
module.exports = { testAllWebhooks };

// Run the test if this file is executed directly
if (require.main === module) {
  testAllWebhooks().catch(error => {
    console.error('❌ Webhook testing failed:', error);
    process.exit(1);
  });
}
