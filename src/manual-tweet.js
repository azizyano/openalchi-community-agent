require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const { postDailyTweet } = require('./post');

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

// Send a manual tweet
async function sendManualTweet() {
  console.log('🚀 OpenALCHI Manual Tweet Tool');
  console.log('==============================\n');
  
  try {
    console.log('Generating and posting tweet...\n');
    await postDailyTweet(client);
    console.log('\n✅ Tweet sent successfully!');
  } catch (error) {
    console.error('\n❌ Failed to send tweet:', error.message);
    process.exit(1);
  }
}

// Run the manual tweet
sendManualTweet().then(() => {
  console.log('\nDone! 👋');
  process.exit(0);
});
