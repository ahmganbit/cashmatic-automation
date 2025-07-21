#!/usr/bin/env node

// AUTOMATED SCHEDULER - Runs your entire affiliate marketing system 24/7
// This script handles all automation tasks on a schedule

const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoScheduler {
  constructor() {
    this.logFile = path.join(__dirname, 'automation.log');
    this.isRunning = false;
    this.tasks = [];
    
    // Schedule configuration
    this.schedule = {
      // Content generation every 6 hours
      contentGeneration: '0 */6 * * *',
      
      // Blog posts every 24 hours at 9 AM
      blogPosts: '0 9 * * *',
      
      // Social media posts every 4 hours
      socialPosts: '0 */4 * * *',
      
      // Email sequences every 48 hours
      emailSequence: '0 10 */2 * *',
      
      // Performance monitoring every 30 minutes
      monitoring: '*/30 * * * *',
      
      // Webhook testing daily at midnight
      webhookTest: '0 0 * * *',
      
      // System health check every 12 hours
      healthCheck: '0 */12 * * *'
    };
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFile, logMessage);
  }

  async runCommand(command, description) {
    return new Promise((resolve, reject) => {
      this.log(`🚀 Starting: ${description}`);
      
      exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          this.log(`❌ Error in ${description}: ${error.message}`);
          reject(error);
        } else {
          this.log(`✅ Completed: ${description}`);
          if (stdout) this.log(`Output: ${stdout.trim()}`);
          resolve(stdout);
        }
      });
    });
  }

  setupScheduledTasks() {
    // Content Generation - Every 6 hours
    this.tasks.push(
      cron.schedule(this.schedule.contentGeneration, async () => {
        await this.runCommand(
          'node plr-funnels-content-generator.js --blog',
          'Generate PLR Funnels blog content'
        );
        await this.runCommand(
          'node plr-funnels-content-generator.js --social',
          'Generate PLR Funnels social content'
        );
      }, { scheduled: false })
    );

    // Blog Posts - Daily at 9 AM
    this.tasks.push(
      cron.schedule(this.schedule.blogPosts, async () => {
        await this.runCommand(
          'node full-automation-system.js generate',
          'Auto-generate and queue blog posts'
        );
        await this.runCommand(
          'node full-automation-system.js post',
          'Auto-post queued blog content'
        );
      }, { scheduled: false })
    );

    // Social Media Posts - Every 4 hours
    this.tasks.push(
      cron.schedule(this.schedule.socialPosts, async () => {
        await this.runCommand(
          'node full-automation-system.js generate',
          'Generate social media content'
        );
        
        // Stagger social posts across platforms
        setTimeout(async () => {
          await this.runCommand(
            'node full-automation-system.js post',
            'Post to Twitter'
          );
        }, 5 * 60 * 1000); // 5 minutes delay
        
        setTimeout(async () => {
          await this.runCommand(
            'node full-automation-system.js post',
            'Post to LinkedIn'
          );
        }, 10 * 60 * 1000); // 10 minutes delay
        
        setTimeout(async () => {
          await this.runCommand(
            'node full-automation-system.js post',
            'Post to Instagram'
          );
        }, 15 * 60 * 1000); // 15 minutes delay
      }, { scheduled: false })
    );

    // Email Sequences - Every 48 hours
    this.tasks.push(
      cron.schedule(this.schedule.emailSequence, async () => {
        await this.runCommand(
          'node plr-funnels-content-generator.js --email',
          'Generate email sequence content'
        );
        await this.runCommand(
          'node full-automation-system.js post',
          'Send automated email sequence'
        );
      }, { scheduled: false })
    );

    // Performance Monitoring - Every 30 minutes
    this.tasks.push(
      cron.schedule(this.schedule.monitoring, async () => {
        await this.runCommand(
          'node full-automation-system.js monitor',
          'Monitor affiliate performance'
        );
        await this.runCommand(
          'node full-automation-system.js status',
          'Check automation system status'
        );
      }, { scheduled: false })
    );

    // Webhook Testing - Daily at midnight
    this.tasks.push(
      cron.schedule(this.schedule.webhookTest, async () => {
        await this.runCommand(
          'node test-all-webhooks.js',
          'Test all webhook integrations'
        );
      }, { scheduled: false })
    );

    // System Health Check - Every 12 hours
    this.tasks.push(
      cron.schedule(this.schedule.healthCheck, async () => {
        await this.systemHealthCheck();
      }, { scheduled: false })
    );

    this.log(`📅 Scheduled ${this.tasks.length} automated tasks`);
  }

  async systemHealthCheck() {
    this.log('🏥 Running system health check...');
    
    try {
      // Check if server is running
      const serverCheck = await this.runCommand(
        'curl -f http://localhost:3000/api/dashboard || echo "Server down"',
        'Check dashboard server'
      );
      
      // Check disk space
      const diskCheck = await this.runCommand(
        'df -h .',
        'Check disk space'
      );
      
      // Check memory usage
      const memoryCheck = await this.runCommand(
        'node -e "console.log(process.memoryUsage())"',
        'Check memory usage'
      );
      
      // Check content queue
      const queueCheck = await this.runCommand(
        'node full-automation-system.js status',
        'Check content queue status'
      );
      
      this.log('✅ System health check completed');
      
    } catch (error) {
      this.log(`⚠️ Health check issue: ${error.message}`);
    }
  }

  start() {
    if (this.isRunning) {
      this.log('⚠️ Scheduler is already running');
      return;
    }

    this.isRunning = true;
    this.log(`
🤖 STARTING AUTOMATED SCHEDULER
===============================
📝 Content generation: Every 6 hours
📰 Blog posts: Daily at 9 AM
📱 Social posts: Every 4 hours
📧 Email sequences: Every 48 hours  
📊 Performance monitoring: Every 30 minutes
🔗 Webhook testing: Daily at midnight
🏥 Health checks: Every 12 hours
===============================
`);

    this.setupScheduledTasks();
    
    // Start all scheduled tasks
    this.tasks.forEach(task => task.start());
    
    // Start the full automation system
    this.runCommand(
      'node full-automation-system.js start',
      'Start full automation system'
    );
    
    this.log('✅ All automation tasks are now scheduled and running!');
    this.log('💰 Your passive income machine is working 24/7');
    
    // Keep the process running
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  stop() {
    if (!this.isRunning) {
      this.log('⚠️ Scheduler is not running');
      return;
    }

    this.isRunning = false;
    this.log('🛑 Stopping automated scheduler...');
    
    // Stop all scheduled tasks
    this.tasks.forEach(task => task.stop());
    
    // Stop the full automation system
    this.runCommand(
      'node full-automation-system.js stop',
      'Stop full automation system'
    );
    
    this.log('✅ Automated scheduler stopped');
    process.exit(0);
  }

  status() {
    this.log(`
📊 SCHEDULER STATUS
==================
🔄 Running: ${this.isRunning ? 'YES' : 'NO'}
📅 Active tasks: ${this.tasks.filter(task => task.running).length}/${this.tasks.length}
📝 Log file: ${this.logFile}
⏰ Current time: ${new Date().toLocaleString()}

📋 SCHEDULED TASKS:
- Content generation: ${this.schedule.contentGeneration}
- Blog posts: ${this.schedule.blogPosts}  
- Social posts: ${this.schedule.socialPosts}
- Email sequences: ${this.schedule.emailSequence}
- Performance monitoring: ${this.schedule.monitoring}
- Webhook testing: ${this.schedule.webhookTest}
- Health checks: ${this.schedule.healthCheck}
`);
  }

  showLogs(lines = 50) {
    try {
      const logs = fs.readFileSync(this.logFile, 'utf8');
      const logLines = logs.split('\n').slice(-lines).join('\n');
      console.log(`
📋 LAST ${lines} LOG ENTRIES:
${logLines}
`);
    } catch (error) {
      this.log('No log file found yet');
    }
  }

  // Manual trigger functions
  async triggerContentGeneration() {
    this.log('🎯 Manually triggering content generation...');
    await this.runCommand('node plr-funnels-content-generator.js --blog', 'Manual blog generation');
    await this.runCommand('node plr-funnels-content-generator.js --social', 'Manual social generation');
    await this.runCommand('node plr-funnels-content-generator.js --email', 'Manual email generation');
  }

  async triggerPosting() {
    this.log('🎯 Manually triggering content posting...');
    await this.runCommand('node full-automation-system.js post', 'Manual content posting');
  }

  async triggerMonitoring() {
    this.log('🎯 Manually triggering performance monitoring...');
    await this.runCommand('node full-automation-system.js monitor', 'Manual performance check');
  }
}

// CLI Interface
if (require.main === module) {
  const scheduler = new AutoScheduler();
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.start();
      break;
    case 'stop':
      scheduler.stop();
      break;
    case 'status':
      scheduler.status();
      break;
    case 'logs':
      const lines = parseInt(process.argv[3]) || 50;
      scheduler.showLogs(lines);
      break;
    case 'generate':
      scheduler.triggerContentGeneration();
      break;
    case 'post':
      scheduler.triggerPosting();
      break;
    case 'monitor':
      scheduler.triggerMonitoring();
      break;
    default:
      console.log(`
🤖 AUTOMATED SCHEDULER COMMANDS
===============================
node auto-scheduler.js start     - Start 24/7 automation
node auto-scheduler.js stop      - Stop automation
node auto-scheduler.js status    - Check status
node auto-scheduler.js logs [n]  - Show last n log entries
node auto-scheduler.js generate  - Manually generate content
node auto-scheduler.js post      - Manually post content  
node auto-scheduler.js monitor   - Manually check performance

🚀 QUICK START:
1. node auto-scheduler.js start
2. Let it run 24/7
3. Check logs: node auto-scheduler.js logs
4. Monitor earnings in dashboard: http://localhost:3000

💡 TIP: Run this in the background and forget about it!
Your affiliate income will grow automatically.
`);
  }
}

module.exports = AutoScheduler;
