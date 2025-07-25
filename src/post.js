const axios = require('axios');

async function generatePost() {
  const prompts = [
    'Generate a tweet about OpenALCHI’s NFT creation feature with a link to https://openalchi.xyz.',
    'Generate a tweet promoting a tutorial from https://docs.openalchi.xyz.',
    'Generate a tweet about OpenALCHI’s royalty system with a link to https://openalchi.xyz.',
    'Generate a poll about AI-blockchain use cases with hashtags #Web3 #NFTs.'
  ];
  const fallbacks = [
    '🚀 Create AI-powered NFTs with OpenALCHI! Start now: https://openalchi.xyz #DecentralizedAI #NFTs',
    '🧪 Learn AI-blockchain integration with OpenALCHI’s docs: https://docs.openalchi.xyz #Web3 #OpenSource',
    '💰 Earn royalties with OpenALCHI’s platform! Join: https://openalchi.xyz #DeFi #NFTs',
    'What’s next for #Web3? A) AI-driven NFTs B) DeFi C) Gaming. Vote: https://openalchi.xyz #DecentralizedAI'
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  try {
    console.log('Calling DeepSeek API with prompt:', prompt);
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Generate a short, engaging tweet (280 chars or less) for OpenALCHI, an AI-blockchain project. Focus on NFT creation, royalties, or IPFS. Include a call-to-action and hashtags.'
          },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 3000 // 3-second timeout
      }
    );
    const tweet = response.data.choices[0].message.content;
    console.log('Generated tweet:', tweet);
    return tweet;
  } catch (error) {
    console.error('DeepSeek Error:', error.message);
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    console.log('Using fallback tweet:', fallback);
    return fallback;
  }
}

async function postDailyTweet(client) {
  try {
    const tweet = await generatePost();
    await client.v2.tweet(tweet);
    console.log('Posted tweet:', tweet);
  } catch (error) {
    console.error('Error posting tweet:', error.message);
  }
}

module.exports = { postDailyTweet };