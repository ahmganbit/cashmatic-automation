#!/usr/bin/env node

// AFFILIATE INFORMATION COLLECTOR
// Helps you gather and organize all info needed for affiliate applications

const readline = require('readline');
const fs = require('fs');
const path = require('path');

class AffiliateInfoCollector {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.info = {
      personal: {},
      business: {},
      platforms: {},
      experience: {},
      applications: {}
    };
    
    this.outputFile = path.join(__dirname, 'my-affiliate-info.json');
  }

  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async collectPersonalInfo() {
    console.log('\n🔸 PERSONAL INFORMATION');
    console.log('=====================================');
    
    this.info.personal.fullName = await this.ask('Full Legal Name: ');
    this.info.personal.email = await this.ask('Email Address: ');
    this.info.personal.phone = await this.ask('Phone Number: ');
    this.info.personal.address = await this.ask('Street Address: ');
    this.info.personal.city = await this.ask('City: ');
    this.info.personal.state = await this.ask('State/Province: ');
    this.info.personal.zip = await this.ask('ZIP/Postal Code: ');
    this.info.personal.country = await this.ask('Country: ');
    this.info.personal.taxId = await this.ask('Tax ID/SSN (optional): ');
    this.info.personal.paypalEmail = await this.ask('PayPal Email: ');
  }

  async collectBusinessInfo() {
    console.log('\n🔸 BUSINESS INFORMATION');
    console.log('=====================================');
    
    this.info.business.businessName = await this.ask('Business Name (if applicable): ');
    this.info.business.website = await this.ask('Primary Website URL: ');
    this.info.business.blogUrl = await this.ask('Blog URL (if different): ');
    this.info.business.niche = await this.ask('Your Niche/Industry: ');
    this.info.business.targetAudience = await this.ask('Target Audience Description: ');
    this.info.business.monthlyTraffic = await this.ask('Monthly Website Traffic (estimate): ');
    this.info.business.emailListSize = await this.ask('Email List Size (estimate): ');
  }

  async collectPlatformInfo() {
    console.log('\n🔸 SOCIAL MEDIA PLATFORMS');
    console.log('=====================================');
    
    this.info.platforms.youtube = await this.ask('YouTube Channel URL: ');
    this.info.platforms.instagram = await this.ask('Instagram Handle (@username): ');
    this.info.platforms.twitter = await this.ask('Twitter Handle (@username): ');
    this.info.platforms.linkedin = await this.ask('LinkedIn Profile URL: ');
    this.info.platforms.facebook = await this.ask('Facebook Page URL: ');
    this.info.platforms.tiktok = await this.ask('TikTok Handle (@username): ');
    this.info.platforms.totalFollowers = await this.ask('Total Social Media Followers (estimate): ');
  }

  async collectExperienceInfo() {
    console.log('\n🔸 MARKETING EXPERIENCE');
    console.log('=====================================');
    
    this.info.experience.yearsMarketing = await this.ask('Years in Digital Marketing: ');
    this.info.experience.affiliateExperience = await this.ask('Previous Affiliate Marketing Experience (Y/N): ');
    this.info.experience.contentCreation = await this.ask('Experience with Content Creation (Y/N): ');
    this.info.experience.emailMarketing = await this.ask('Experience with Email Marketing (Y/N): ');
    this.info.experience.paidAds = await this.ask('Experience with Paid Advertising (Y/N): ');
    this.info.experience.seo = await this.ask('Experience with SEO (Y/N): ');
    
    console.log('\nMarketing Methods You Use (enter Y/N for each):');
    this.info.experience.methods = {
      contentMarketing: await this.ask('Content Marketing: '),
      emailMarketing: await this.ask('Email Marketing: '),
      socialMedia: await this.ask('Social Media Marketing: '),
      paidAds: await this.ask('Paid Advertising: '),
      seo: await this.ask('SEO: '),
      influencer: await this.ask('Influencer Marketing: ')
    };
  }

  generateApplicationText() {
    const { personal, business, platforms, experience } = this.info;
    
    return {
      jasperAI: `
JASPER AI APPLICATION TEXT:
===========================

Website: ${business.website}
Niche: ${business.niche}
Target Audience: ${business.targetAudience}
Email List Size: ${business.emailListSize}
Social Media Following: ${platforms.totalFollowers}

How I'll Promote Jasper:
"I run a ${business.niche} blog focused on digital marketing automation and AI tools. I help entrepreneurs streamline their content creation process using AI. I plan to create detailed tutorials, case studies, and reviews about Jasper AI, showing how it can help my audience create high-quality content faster. I'll promote through my blog, email list of ${business.emailListSize} subscribers, and social media channels with ${platforms.totalFollowers} followers."

Marketing Experience:
"I have ${experience.yearsMarketing} years of digital marketing experience, specializing in content marketing, email automation, and helping businesses scale their online presence. I understand the challenges of content creation and believe Jasper AI is the perfect solution for my audience."
`,

      getResponse: `
GETRESPONSE APPLICATION TEXT:
=============================

Website: ${business.website}
Marketing Experience: ${experience.yearsMarketing} years in digital marketing
Target Audience: ${business.targetAudience}
Monthly Traffic: ${business.monthlyTraffic}
Email List Size: ${business.emailListSize}

How I'll Promote GetResponse:
"I help entrepreneurs build automated marketing systems and scale their online businesses. My audience consists of ${business.targetAudience} who are looking for reliable email marketing solutions. I plan to create comprehensive tutorials about email automation, list building strategies, and marketing funnels using GetResponse. I'll promote through my blog content, email sequences, social media, and potentially paid advertising."

Why GetResponse:
"I believe GetResponse offers the best combination of features and affordability for small to medium businesses. The automation capabilities and landing page builder make it perfect for my audience who want an all-in-one marketing solution."
`,

      teachable: `
TEACHABLE APPLICATION TEXT:
===========================

Website: ${business.website}
Content Focus: Online business education and digital marketing training
Target Audience: ${business.targetAudience}
Experience: ${experience.yearsMarketing} years in digital marketing and online business
Audience Size: ${business.emailListSize} email subscribers, ${platforms.totalFollowers} social media followers

How I'll Promote Teachable:
"I create content about building passive income streams and online businesses. My audience is highly interested in creating and selling online courses as a revenue stream. I plan to create detailed guides about course creation, marketing strategies for course creators, and platform comparisons featuring Teachable. I'll promote through blog posts, email sequences, social media content, and potentially webinars."

Course Creation Experience:
"I understand the challenges of creating and marketing online courses. I help entrepreneurs package their knowledge into profitable digital products, making Teachable a natural fit for my audience's needs."
`
    };
  }

  saveInfo() {
    const applicationTexts = this.generateApplicationText();
    const completeInfo = {
      ...this.info,
      applicationTexts,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(this.outputFile, JSON.stringify(completeInfo, null, 2));
    console.log(`\n✅ Information saved to: ${this.outputFile}`);
  }

  displaySummary() {
    const { personal, business, platforms, experience } = this.info;
    
    console.log(`
🎉 AFFILIATE APPLICATION INFORMATION COLLECTED!
===============================================

📋 PERSONAL INFO:
Name: ${personal.fullName}
Email: ${personal.email}
Location: ${personal.city}, ${personal.state}, ${personal.country}

🏢 BUSINESS INFO:
Website: ${business.website}
Niche: ${business.niche}
Monthly Traffic: ${business.monthlyTraffic}
Email List: ${business.emailListSize}

📱 SOCIAL PLATFORMS:
Instagram: ${platforms.instagram}
Twitter: ${platforms.twitter}
LinkedIn: ${platforms.linkedin}
Total Followers: ${platforms.totalFollowers}

💼 EXPERIENCE:
Marketing Years: ${experience.yearsMarketing}
Affiliate Experience: ${experience.affiliateExperience}
Content Creation: ${experience.contentCreation}

🚀 NEXT STEPS:
1. Review your application texts in: ${this.outputFile}
2. Apply to Jasper AI first: https://jasper.ai/partners
3. Apply to GetResponse: https://www.getresponse.com/affiliates
4. Apply to Teachable: https://teachable.com/affiliates
5. Update your automation system when approved!

💰 POTENTIAL EARNINGS WITH ALL PROGRAMS:
Conservative: $1,156/month
Moderate: $3,468/month
Aggressive: $11,560/month

🔥 Your automation system is ready to promote all these programs!
`);
  }

  async run() {
    console.log(`
🎯 AFFILIATE INFORMATION COLLECTOR
==================================
This tool will help you gather all the information needed
to apply for high-paying affiliate programs.

We'll collect:
✅ Personal & business information
✅ Website & social media details  
✅ Marketing experience
✅ Generate application texts for you

Let's get started!
`);

    try {
      await this.collectPersonalInfo();
      await this.collectBusinessInfo();
      await this.collectPlatformInfo();
      await this.collectExperienceInfo();
      
      this.saveInfo();
      this.displaySummary();
      
    } catch (error) {
      console.log('\n❌ Error collecting information:', error.message);
    } finally {
      this.rl.close();
    }
  }

  loadExisting() {
    try {
      if (fs.existsSync(this.outputFile)) {
        const data = JSON.parse(fs.readFileSync(this.outputFile, 'utf8'));
        console.log('\n📋 EXISTING AFFILIATE INFORMATION FOUND:');
        console.log('========================================');
        console.log(`Name: ${data.personal?.fullName || 'Not set'}`);
        console.log(`Email: ${data.personal?.email || 'Not set'}`);
        console.log(`Website: ${data.business?.website || 'Not set'}`);
        console.log(`Niche: ${data.business?.niche || 'Not set'}`);
        console.log(`Generated: ${new Date(data.generatedAt).toLocaleString()}`);
        
        if (data.applicationTexts) {
          console.log('\n🎯 APPLICATION TEXTS READY FOR:');
          console.log('- Jasper AI');
          console.log('- GetResponse');
          console.log('- Teachable');
          console.log(`\nView full details in: ${this.outputFile}`);
        }
        
        return true;
      }
    } catch (error) {
      console.log('No existing information found.');
    }
    return false;
  }
}

// CLI Interface
if (require.main === module) {
  const collector = new AffiliateInfoCollector();
  const command = process.argv[2];
  
  if (command === 'view') {
    collector.loadExisting();
  } else {
    const hasExisting = collector.loadExisting();
    if (hasExisting) {
      console.log('\n⚠️ You already have affiliate information collected.');
      console.log('Run with "view" to see it, or continue to update it.');
    }
    collector.run();
  }
}

module.exports = AffiliateInfoCollector;
