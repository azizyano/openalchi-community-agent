const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function generatePost() {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a community manager for OpenALCHI, an open-source AI-blockchain project. Generate a concise, engaging tweet (280 characters or less) promoting OpenALCHI’s features (e.g., NFT creation, royalties, IPFS). Include a call-to-action and relevant hashtags.',
          },
          {
            role: 'user',
            content: 'Create a tweet for OpenALCHI, linking to https://openalchi.xyz or https://docs.openalchi.xyz.',
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating post:', error);
    return 'Discover OpenALCHI: Build AI-driven NFTs with royalties on a decentralized platform! 🚀 Join us at https://openalchi.xyz #DecentralizedAI #NFTs';
  }
}

async function postDailyTweet() {
  try {
    const tweet = await generatePost();
    await client.v2.tweet(tweet);
    console.log('Posted tweet:', tweet);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

module.exports = { postDailyTweet };