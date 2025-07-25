require('dotenv').config();
const schedule = require('node-schedule');
const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const { postDailyTweet } = require('./post');
const { engageWithCommunity } = require('./engage');
const { analyzeEngagement } = require('./Analytics');
const config = require('./config');

// Validate environment variables
console.log('=== Environment Check ===');
console.log('X API Key:', process.env.X_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('X API Secret:', process.env.X_API_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('X Access Token:', process.env.X_ACCESS_TOKEN ? '✅ Loaded' : '❌ Missing');
console.log('X Access Token Secret:', process.env.X_ACCESS_TOKEN_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('========================\n');

// Test OpenRouter API
async function testOpenRouter() {
  console.log('Testing OpenRouter API...');
  try {
    const response = await axios.post(
      config.openRouter.apiUrl,
      {
        model: config.openRouter.model,
        messages: [
          { 
            role: 'user', 
            content: 'Generate a test tweet for OpenALCHI project in 50 words or less.' 
          }
        ],
        max_tokens: 100
      },
      {
        headers: { 
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://openalchi.xyz',
          'X-Title': 'OpenALCHI Tweet Bot'
        },
        timeout: 10000
      }
    );
    
    if (response.data && response.data.choices && response.data.choices[0]) {
      console.log('✅ OpenRouter Test Success!');
      console.log('Test Response:', response.data.choices[0].message.content);
      console.log('Model used:', config.openRouter.model);
    }
  } catch (error) {
    console.error('❌ OpenRouter Test Failed:', error.message);
    if (error.response) {
      console.error('Response details:', error.response.data);
    }
  }
}

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

// Test Twitter connection
async function testTwitterConnection() {
  try {
    console.log('\nTesting Twitter connection...');
    const me = await client.v2.me();
    console.log('✅ Twitter connection successful!');
    console.log('Authenticated as: @' + me.data.username);
    console.log('Account name:', me.data.name);
  } catch (error) {
    console.error('❌ Twitter connection failed:', error.message);
  }
}

// Manual tweet function (for testing)
async function sendManualTweet() {
  console.log('\n📤 Sending manual tweet...');
  try {
    await postDailyTweet(client);
  } catch (error) {
    console.error('Manual tweet failed:', error.message);
  }
}

// Run initial tests
async function runInitialTests() {
  await testOpenRouter();
  await testTwitterConnection();
  
  // Ask if user wants to send a test tweet
  console.log('\n💡 To send a test tweet, run: npm run tweet');
  console.log('   Or press Ctrl+T while the bot is running\n');
}

// Display schedule information
function displayScheduleInfo() {
  console.log('\n📅 Scheduled Tasks:');
  console.log(`├─ Daily Tweet: ${config.schedule.dailyTweet}`);
  console.log(`├─ Community Engagement: ${config.schedule.communityEngagement}`);
  console.log(`└─ Weekly Analytics: ${config.schedule.weeklyAnalytics}`);
  
  console.log('\n⏰ Current server time:', new Date().toLocaleString());
  
  // Calculate next run times
  const dailyJob = schedule.scheduleJob('temp1', config.schedule.dailyTweet, () => {});
  const nextDaily = dailyJob.nextInvocation();
  dailyJob.cancel();
  
  console.log('📍 Next daily tweet:', nextDaily ? nextDaily.toLocaleString() : 'Invalid schedule');
}

// Schedule the daily tweet
const dailyTweetJob = schedule.scheduleJob(config.schedule.dailyTweet, async () => {
  console.log('\n🚀 Running scheduled daily tweet...');
  console.log('Time:', new Date().toLocaleString());
  try {
    await postDailyTweet(client);
    console.log('✅ Daily tweet posted successfully!');
    
    // Show next scheduled time
    const next = dailyTweetJob.nextInvocation();
    console.log('📍 Next tweet scheduled for:', next ? next.toLocaleString() : 'Unknown');
  } catch (error) {
    console.error('❌ Daily tweet error:', error.message);
  }
});

// Schedule community engagement (optional)
const engagementJob = schedule.scheduleJob(config.schedule.communityEngagement, async () => {
  console.log('\n💬 Running community engagement task...');
  try {
    await engageWithCommunity(client);
    console.log('✅ Engagement task completed!');
  } catch (error) {
    console.error('Engagement error:', error.message);
  }
});

// Schedule weekly analytics (optional)
const analyticsJob = schedule.scheduleJob(config.schedule.weeklyAnalytics, async () => {
  console.log('\n📊 Running weekly analytics task...');
  try {
    await analyzeEngagement(client);
    console.log('✅ Analytics task completed!');
  } catch (error) {
    console.error('Analytics error:', error.message);
  }
});

// Handle keyboard input for manual tweet
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.on('data', async (key) => {
    // Ctrl+C to exit
    if (key[0] === 3) {
      console.log('\n\nShutting down gracefully...');
      process.exit(0);
    }
    // Ctrl+T to send manual tweet
    if (key[0] === 20) {
      await sendManualTweet();
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  dailyTweetJob.cancel();
  engagementJob.cancel();
  analyticsJob.cancel();
  process.exit(0);
});

// Start the bot
console.log('\n🤖 OpenALCHI Community Agent is starting...');
console.log('═══════════════════════════════════════════\n');

// Run initial tests
runInitialTests().then(() => {
  displayScheduleInfo();
  console.log('\n✨ Bot is running! Press Ctrl+C to stop');
  console.log('   Press Ctrl+T to send a manual tweet\n');
});
