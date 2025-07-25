const axios = require('axios');

async function generateEngagementResponse(tweetText, authorId) {
  try {
    console.log('Generating engagement response for tweet:', tweetText);
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly community manager for OpenALCHI. Generate a short, personalized reply (280 characters or less) to a tweet about NFT gaming or AI, inviting the user to explore OpenALCHI. Use their tweet context and include a link to https://openalchi.xyz.'
          },
          { role: 'user', content: `Tweet: "${tweetText}"` }
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
    const reply = response.data.choices[0].message.content;
    console.log('Generated reply:', reply);
    return reply;
  } catch (error) {
    console.error('Error generating engagement response:', error.message);
    return `Hey! Excited about NFTs? Check out OpenALCHI for AI-driven NFT creation! 🚀 https://openalchi.xyz #NFTs`;
  }
}

async function engageWithCommunity(client) {
  try {
    const searchQuery = '#NFTGaming OR #DecentralizedAI -from:TOpenAlchi';
    console.log('Searching tweets with query:', searchQuery);
    const searchResults = await client.v2.search(searchQuery);
    let replyCount = 0;
    for await (const tweet of searchResults) {
      if (replyCount >= 5) break; // Limit to 5 replies/day
      const response = await generateEngagementResponse(tweet.text, tweet.author_id);
      await client.v2.reply(response, tweet.id);
      console.log(`Replied to tweet ${tweet.id}: ${response}`);
      replyCount++;
    }
  } catch (error) {
    console.error('Error engaging with community:', error.message);
  }
}

module.exports = { engageWithCommunity };