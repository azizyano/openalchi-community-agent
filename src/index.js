require('dotenv').config();
const schedule = require('node-schedule');
const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const { postDailyTweet } = require('./post');
const { engageWithCommunity } = require('./engage');
const { analyzeEngagement } = require('./Analytics');

console.log('API Key:', process.env.X_API_KEY ? 'Loaded' : 'Missing');
console.log('DeepSeek API Key:', process.env.DEEPSEEK_API_KEY ? 'Loaded' : 'Missing');

// Test DeepSeek API
async function testDeepSeek() {
  try {
    console.log('Testing DeepSeek API...');
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Generate a test tweet.' }]
      },
      {
        headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
        timeout: 3000
      }
    );
    console.log('DeepSeek Test Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('DeepSeek Test Error:', error.message);
  }
}
testDeepSeek();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function runTests() {
  try {
    console.log('Testing daily tweet...');
    await postDailyTweet(client);
    console.log('Testing community engagement...');
    await engageWithCommunity(client);
    console.log('Testing analytics...');
    await analyzeEngagement(client);
  } catch (error) {
    console.error('Test error:', error.message);
  }
}
runTests();

schedule.scheduleJob('0 9 * * *', () => {
  console.log('Running daily tweet task...');
  postDailyTweet(client).catch(error => console.error('Daily tweet error:', error.message));
});

schedule.scheduleJob('0 11 * * *', () => {
  console.log('Running community engagement task...');
  engageWithCommunity(client).catch(error => console.error('Engagement error:', error.message));
});

schedule.scheduleJob('0 8 * * 1', () => {
  console.log('Running weekly analytics task...');
  analyzeEngagement(client).catch(error => console.error('Analytics error:', error.message));
});

console.log('OpenALCHI Community Agent is running...');