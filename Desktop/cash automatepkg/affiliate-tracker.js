// Affiliate Application Tracker
// Run this script to track your affiliate application progress

const affiliatePrograms = [
  {
    name: "ClickFunnels",
    url: "https://www.clickfunnels.com/affiliates",
    commission: 497,
    priority: "HIGHEST",
    expectedApproval: "24-48 hours",
    status: "ready_to_apply",
    notes: "This is your highest priority - $497 per sale!"
  },
  {
    name: "Jasper AI",
    url: "https://jasper.ai/partners",
    commission: 89,
    priority: "HIGH",
    expectedApproval: "Usually instant",
    status: "ready_to_apply",
    notes: "AI writing tool, great for content creators"
  },
  {
    name: "GetResponse",
    url: "https://www.getresponse.com/affiliates",
    commission: 120,
    priority: "MEDIUM",
    expectedApproval: "24 hours",
    status: "ready_to_apply",
    notes: "Email marketing platform"
  },
  {
    name: "Teachable",
    url: "https://teachable.com/affiliates",
    commission: 450,
    priority: "HIGH",
    expectedApproval: "2-5 days (manual review)",
    status: "ready_to_apply",
    notes: "Online course platform, high commission"
  }
];

// Function to display current status
function displayStatus() {
  console.log("\n🚀 AFFILIATE PROGRAM APPLICATION TRACKER");
  console.log("=" .repeat(50));
  
  affiliatePrograms.forEach((program, index) => {
    console.log(`\n${index + 1}. ${program.name}`);
    console.log(`   💰 Commission: $${program.commission} per sale`);
    console.log(`   ⭐ Priority: ${program.priority}`);
    console.log(`   ⏰ Expected Approval: ${program.expectedApproval}`);
    console.log(`   🔗 Apply at: ${program.url}`);
    console.log(`   📝 Status: ${program.status.replace('_', ' ').toUpperCase()}`);
    console.log(`   💡 Notes: ${program.notes}`);
  });
  
  console.log("\n" + "=" .repeat(50));
  console.log("📋 NEXT ACTIONS:");
  console.log("1. Apply to ClickFunnels FIRST (highest commission)");
  console.log("2. Apply to all others in parallel");
  console.log("3. Check emails in 24-48 hours");
  console.log("4. Update your automation tool with real links");
}

// Function to update application status
function updateStatus(programName, newStatus, affiliateLink = null) {
  const program = affiliatePrograms.find(p => 
    p.name.toLowerCase() === programName.toLowerCase()
  );
  
  if (program) {
    program.status = newStatus;
    if (affiliateLink) {
      program.affiliateLink = affiliateLink;
    }
    program.lastUpdated = new Date().toISOString();
    
    console.log(`✅ Updated ${program.name} status to: ${newStatus}`);
    
    // Update the automation tool via API
    updateAutomationTool(program);
  } else {
    console.log(`❌ Program "${programName}" not found`);
  }
}

// Function to update the automation tool
async function updateAutomationTool(program) {
  try {
    const response = await fetch('http://localhost:3000/api/affiliate-programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: program.name,
        commission: program.commission,
        affiliateLink: program.affiliateLink || program.url,
        status: program.status === 'approved' ? 'approved' : 'pending'
      })
    });
    
    if (response.ok) {
      console.log(`✅ Updated automation tool for ${program.name}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not update automation tool: ${error.message}`);
  }
}

// Function to generate application checklist
function generateChecklist() {
  console.log("\n📋 APPLICATION CHECKLIST");
  console.log("=" .repeat(30));
  
  console.log("\n🎯 TODAY'S TASKS:");
  affiliatePrograms.forEach((program, index) => {
    console.log(`[ ] ${index + 1}. Apply to ${program.name} (${program.url})`);
  });
  
  console.log("\n📧 FOLLOW-UP TASKS (24-48 hours):");
  console.log("[ ] Check email for ClickFunnels approval");
  console.log("[ ] Check email for Jasper AI approval");
  console.log("[ ] Check email for GetResponse approval");
  console.log("[ ] Check email for Teachable approval");
  
  console.log("\n🔗 ONCE APPROVED:");
  console.log("[ ] Copy real affiliate links");
  console.log("[ ] Update automation tool");
  console.log("[ ] Test all links");
  console.log("[ ] Create first content with links");
}

// Function to calculate potential earnings
function calculatePotential() {
  console.log("\n💰 POTENTIAL EARNINGS CALCULATOR");
  console.log("=" .repeat(35));
  
  const scenarios = [
    { sales: 1, period: "week" },
    { sales: 2, period: "week" },
    { sales: 1, period: "day" }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n📊 If you make ${scenario.sales} sale(s) per ${scenario.period}:`);
    
    affiliatePrograms.forEach(program => {
      const multiplier = scenario.period === "week" ? scenario.sales : scenario.sales * 7;
      const weeklyEarnings = program.commission * multiplier;
      const monthlyEarnings = weeklyEarnings * 4;
      
      console.log(`   ${program.name}: $${weeklyEarnings}/week, $${monthlyEarnings}/month`);
    });
  });
}

// Main execution
console.log("🚀 Starting Affiliate Tracker...");

// Display current status
displayStatus();

// Generate checklist
generateChecklist();

// Calculate potential
calculatePotential();

// Export functions for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    displayStatus,
    updateStatus,
    generateChecklist,
    calculatePotential,
    affiliatePrograms
  };
}

// Example usage:
console.log("\n🔧 USAGE EXAMPLES:");
console.log("To update status: updateStatus('ClickFunnels', 'approved', 'your-real-link')");
console.log("To check status: displayStatus()");
console.log("To see checklist: generateChecklist()");

// Instructions
console.log("\n📝 INSTRUCTIONS:");
console.log("1. Open each affiliate program URL in your browser");
console.log("2. Fill out applications with your real information");
console.log("3. Check your email regularly for approval notifications");
console.log("4. Run updateStatus() when you get approved");
console.log("5. Update your automation tool with real affiliate links");

console.log("\n🎯 START WITH CLICKFUNNELS - HIGHEST COMMISSION!");
console.log("Apply now: https://www.clickfunnels.com/affiliates");
