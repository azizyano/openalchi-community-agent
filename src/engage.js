const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function generateEngagementResponse(tweetText, authorId) {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly community manager for OpenALCHI. Generate a short, personalized reply (280 characters or less) to a tweet about NFT gaming or AI, inviting the user to explore OpenALCHI. Use their tweet context and include a link to https://openalchi.xyz.',
          },
          {
            role: 'user',
            content: `Tweet: "${tweetText}"`,
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
    return `Hey! Excited about NFTs? Check out OpenALCHI for AI-driven NFT creation & royalties! 🚀 https://openalchi.xyz #NFTs`;
  }
}

async function engageWithCommunity() {
  try {
    const searchResults = await client.v2.search('#NFTGaming OR #DecentralizedAI -from:@TOpenAlchi');
    for await (const tweet of searchResults) {
      const response = await generateEngagementResponse(tweet.text, tweet.author_id);
      await client.v2.reply(response, tweet.id);
      console.log(`Replied to tweet ${tweet.id}: ${response}`);
    }
  } catch (error) {
    console.error('Error engaging with community:', error);
  }
}

module.exports = { engageWithCommunity };