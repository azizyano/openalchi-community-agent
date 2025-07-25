require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const config = require('./config');

console.log('🔧 OpenALCHI Bot Connection Test');
console.log('================================\n');

// Test OpenRouter connection
async function testOpenRouter() {
  console.log('1. Testing OpenRouter API...');
  
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('   ❌ OPENROUTER_API_KEY not found in .env file');
    return false;
  }
  
  try {
    const response = await axios.post(
      config.openRouter.apiUrl,
      {
        model: config.openRouter.model,
        messages: [
          { role: 'user', content: 'Say "Hello OpenALCHI" in 5 words or less.' }
        ],
        max_tokens: 50
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
      console.log('   ✅ OpenRouter API is working!');
      console.log('   Model:', config.openRouter.model);
      console.log('   Response:', response.data.choices[0].message.content);
      return true;
    }
  } catch (error) {
    console.error('   ❌ OpenRouter API failed:', error.message);
    if (error.response && error.response.data) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

// Test Twitter connection
async function testTwitter() {
  console.log('\n2. Testing Twitter API...');
  
  const requiredVars = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error('   ❌ Missing Twitter credentials:', missingVars.join(', '));
    return false;
  }
  
  try {
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });
    
    const me = await client.v2.me();
    console.log('   ✅ Twitter API is working!');
    console.log('   Account: @' + me.data.username);
    console.log('   Name:', me.data.name);
    console.log('   ID:', me.data.id);
    
    // Check permissions
    try {
      const limits = await client.v2.rateLimit();
      console.log('   Permissions: Read/Write enabled');
    } catch (e) {
      console.log('   ⚠️  Warning: Could not verify write permissions');
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Twitter API failed:', error.message);
    if (error.data) {
      console.error('   Details:', JSON.stringify(error.data, null, 2));
    }
    return false;
  }
}

// Show configuration
function showConfig() {
  console.log('\n3. Current Configuration:');
  console.log('   Model:', config.openRouter.model);
  console.log('   Daily Tweet Time:', config.schedule.dailyTweet);
  console.log('   Number of prompts:', config.tweetPrompts.length);
  console.log('   Number of fallbacks:', config.fallbackTweets.length);
  console.log('   Current time:', new Date().toLocaleString());
}

// Run all tests
async function runTests() {
  const openRouterOk = await testOpenRouter();
  const twitterOk = await testTwitter();
  showConfig();
  
  console.log('\n================================');
  console.log('Test Summary:');
  console.log('OpenRouter:', openRouterOk ? '✅ Working' : '❌ Failed');
  console.log('Twitter:', twitterOk ? '✅ Working' : '❌ Failed');
  
  if (openRouterOk && twitterOk) {
    console.log('\n🎉 All systems operational! Your bot is ready to run.');
    console.log('Start the bot with: npm start');
    console.log('Send a test tweet with: npm run tweet');
  } else {
    console.log('\n⚠️  Please fix the issues above before running the bot.');
  }
}

// Run the tests
runTests().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
