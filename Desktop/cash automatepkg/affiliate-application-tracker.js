#!/usr/bin/env node

// AFFILIATE APPLICATION TRACKER
// Tracks application status and manages follow-ups for all affiliate programs

const fs = require('fs');
const path = require('path');

class AffiliateApplicationTracker {
  constructor() {
    this.applications = {
      liquidweb: {
        name: "Liquid Web",
        url: "https://www.liquidweb.com/partners/affiliate-program/",
        commission: "Up to $7,000 per sale",
        priority: "HIGHEST",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "Ultra high-ticket hosting - 300% commission rate",
        requirements: "Website, traffic stats, marketing plan"
      },
      authorityhacker: {
        name: "Authority Hacker",
        url: "https://forms.authorityhacker.com/affiliate-application",
        commission: "20-40% (up to $1,500/sale)",
        priority: "HIGHEST",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "Perfect audience fit for digital marketing",
        requirements: "Website, audience description, promotion plan"
      },
      semrush: {
        name: "Semrush",
        url: "https://www.semrush.com/lp/affiliate-program/en/",
        commission: "40% recurring (up to $200/month)",
        priority: "HIGH",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "120-day cookie, lifetime recurring",
        requirements: "Website, SEO content focus"
      },
      kinsta: {
        name: "Kinsta",
        url: "https://kinsta.com/affiliates/",
        commission: "$50-$500 + 10% recurring",
        priority: "HIGH",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "Premium hosting audience",
        requirements: "Website, hosting content focus"
      },
      getresponse: {
        name: "GetResponse",
        url: "https://www.getresponse.com/affiliates",
        commission: "$120/month recurring + bonuses",
        priority: "MEDIUM",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "Good email marketing fit",
        requirements: "Website, email marketing content"
      },
      teachable: {
        name: "Teachable",
        url: "https://teachable.com/affiliates",
        commission: "$450/month recurring",
        priority: "MEDIUM",
        status: "pending",
        appliedDate: null,
        followUpDate: null,
        notes: "Course creation audience",
        requirements: "Website, course/education content"
      },
      clickfunnels: {
        name: "ClickFunnels PLR",
        url: "https://www.plrfunnels.com/plr?aff=df85f82408d6be56fbd3d5189cb62",
        commission: "$497 per sale",
        priority: "ACTIVE",
        status: "approved",
        appliedDate: "2025-07-19",
        approvedDate: "2025-07-19",
        notes: "Already active and generating income",
        requirements: "None - already approved"
      }
    };
    
    this.loadApplicationData();
  }

  // Load application data from file if exists
  loadApplicationData() {
    const dataFile = path.join(__dirname, 'application-tracker-data.json');
    if (fs.existsSync(dataFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        this.applications = { ...this.applications, ...data };
      } catch (error) {
        console.log('Error loading application data:', error.message);
      }
    }
  }

  // Save application data to file
  saveApplicationData() {
    const dataFile = path.join(__dirname, 'application-tracker-data.json');
    try {
      fs.writeFileSync(dataFile, JSON.stringify(this.applications, null, 2));
      console.log('✅ Application data saved successfully');
    } catch (error) {
      console.log('❌ Error saving application data:', error.message);
    }
  }

  // Mark application as submitted
  markAsApplied(programKey) {
    if (this.applications[programKey]) {
      this.applications[programKey].status = 'applied';
      this.applications[programKey].appliedDate = new Date().toISOString().split('T')[0];
      this.applications[programKey].followUpDate = this.calculateFollowUpDate();
      this.saveApplicationData();
      console.log(`✅ Marked ${this.applications[programKey].name} as applied`);
    }
  }

  // Mark application as approved
  markAsApproved(programKey) {
    if (this.applications[programKey]) {
      this.applications[programKey].status = 'approved';
      this.applications[programKey].approvedDate = new Date().toISOString().split('T')[0];
      this.saveApplicationData();
      console.log(`🎉 ${this.applications[programKey].name} application approved!`);
    }
  }

  // Mark application as rejected
  markAsRejected(programKey, reason = '') {
    if (this.applications[programKey]) {
      this.applications[programKey].status = 'rejected';
      this.applications[programKey].rejectedDate = new Date().toISOString().split('T')[0];
      this.applications[programKey].rejectionReason = reason;
      this.saveApplicationData();
      console.log(`❌ ${this.applications[programKey].name} application rejected: ${reason}`);
    }
  }

  // Calculate follow-up date (7 days from application)
  calculateFollowUpDate() {
    const followUp = new Date();
    followUp.setDate(followUp.getDate() + 7);
    return followUp.toISOString().split('T')[0];
  }

  // Get applications that need follow-up
  getFollowUpNeeded() {
    const today = new Date().toISOString().split('T')[0];
    const needFollowUp = [];
    
    for (const [key, app] of Object.entries(this.applications)) {
      if (app.status === 'applied' && app.followUpDate && app.followUpDate <= today) {
        needFollowUp.push({ key, ...app });
      }
    }
    
    return needFollowUp;
  }

  // Get applications by priority
  getByPriority(priority) {
    return Object.entries(this.applications)
      .filter(([key, app]) => app.priority === priority)
      .map(([key, app]) => ({ key, ...app }));
  }

  // Get applications by status
  getByStatus(status) {
    return Object.entries(this.applications)
      .filter(([key, app]) => app.status === status)
      .map(([key, app]) => ({ key, ...app }));
  }

  // Display status report
  displayStatusReport() {
    console.log('\n🎯 AFFILIATE APPLICATION STATUS REPORT');
    console.log('=====================================\n');
    
    const approved = this.getByStatus('approved');
    const applied = this.getByStatus('applied');
    const pending = this.getByStatus('pending');
    const rejected = this.getByStatus('rejected');
    
    console.log(`✅ APPROVED (${approved.length}):`);
    approved.forEach(app => {
      console.log(`   • ${app.name} - ${app.commission}`);
    });
    
    console.log(`\n📝 APPLIED (${applied.length}):`);
    applied.forEach(app => {
      console.log(`   • ${app.name} - Applied: ${app.appliedDate} - Follow-up: ${app.followUpDate}`);
    });
    
    console.log(`\n⏳ PENDING (${pending.length}):`);
    pending.forEach(app => {
      console.log(`   • ${app.name} - Priority: ${app.priority} - ${app.commission}`);
    });
    
    if (rejected.length > 0) {
      console.log(`\n❌ REJECTED (${rejected.length}):`);
      rejected.forEach(app => {
        console.log(`   • ${app.name} - Reason: ${app.rejectionReason || 'Not specified'}`);
      });
    }
    
    const followUps = this.getFollowUpNeeded();
    if (followUps.length > 0) {
      console.log(`\n🔔 FOLLOW-UPS NEEDED (${followUps.length}):`);
      followUps.forEach(app => {
        console.log(`   • ${app.name} - Applied: ${app.appliedDate}`);
      });
    }
    
    console.log('\n💰 POTENTIAL MONTHLY EARNINGS:');
    const totalPotential = this.calculatePotentialEarnings();
    console.log(`   Conservative (1 sale each): $${totalPotential.conservative}/month`);
    console.log(`   Moderate (3 sales each): $${totalPotential.moderate}/month`);
    console.log(`   Aggressive (10+ sales): $${totalPotential.aggressive}/month`);
  }

  // Calculate potential earnings
  calculatePotentialEarnings() {
    const approved = this.getByStatus('approved');
    const commissions = {
      clickfunnels: 497,
      liquidweb: 1000, // Conservative estimate
      authorityhacker: 300,
      semrush: 200,
      kinsta: 300,
      getresponse: 120,
      teachable: 450
    };
    
    let conservative = 0;
    let moderate = 0;
    let aggressive = 0;
    
    Object.keys(commissions).forEach(key => {
      conservative += commissions[key] * 1;
      moderate += commissions[key] * 3;
      aggressive += commissions[key] * 10;
    });
    
    return { conservative, moderate, aggressive };
  }

  // Generate application reminder
  generateApplicationReminder() {
    const pending = this.getByPriority('HIGHEST').filter(app => app.status === 'pending');
    
    if (pending.length > 0) {
      console.log('\n🚨 HIGH PRIORITY APPLICATIONS TO SUBMIT TODAY:');
      pending.forEach(app => {
        console.log(`\n📋 ${app.name.toUpperCase()}`);
        console.log(`   URL: ${app.url}`);
        console.log(`   Commission: ${app.commission}`);
        console.log(`   Requirements: ${app.requirements}`);
        console.log(`   Notes: ${app.notes}`);
      });
    }
  }
}

// CLI Interface
if (require.main === module) {
  const tracker = new AffiliateApplicationTracker();
  const command = process.argv[2];
  const program = process.argv[3];
  const reason = process.argv[4];

  switch (command) {
    case 'status':
      tracker.displayStatusReport();
      break;
    case 'applied':
      if (program) {
        tracker.markAsApplied(program);
      } else {
        console.log('Usage: node affiliate-application-tracker.js applied <program_key>');
      }
      break;
    case 'approved':
      if (program) {
        tracker.markAsApproved(program);
      } else {
        console.log('Usage: node affiliate-application-tracker.js approved <program_key>');
      }
      break;
    case 'rejected':
      if (program) {
        tracker.markAsRejected(program, reason);
      } else {
        console.log('Usage: node affiliate-application-tracker.js rejected <program_key> [reason]');
      }
      break;
    case 'reminder':
      tracker.generateApplicationReminder();
      break;
    case 'followup':
      const followUps = tracker.getFollowUpNeeded();
      if (followUps.length > 0) {
        console.log('🔔 Applications needing follow-up:');
        followUps.forEach(app => console.log(`   • ${app.name}`));
      } else {
        console.log('✅ No follow-ups needed today');
      }
      break;
    default:
      console.log('Available commands:');
      console.log('  status    - Show application status report');
      console.log('  applied   - Mark application as submitted');
      console.log('  approved  - Mark application as approved');
      console.log('  rejected  - Mark application as rejected');
      console.log('  reminder  - Show high priority applications to submit');
      console.log('  followup  - Show applications needing follow-up');
      tracker.displayStatusReport();
  }
}

module.exports = AffiliateApplicationTracker;
