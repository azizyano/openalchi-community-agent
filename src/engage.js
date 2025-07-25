const axios = require('axios');
const config = require('./config');

// Generate contextual replies using AI
async function generateEngagementResponse(tweetText, authorUsername) {
  const prompts = [
    `Reply to this tweet about Web3/NFTs in a friendly, helpful way. Mention OpenALCHI if relevant. Keep it under 280 chars. Tweet: "${tweetText}"`,
    `Write a supportive reply to this NFT/blockchain tweet. Subtly mention OpenALCHI's features. Tweet: "${tweetText}"`,
    `Engage positively with this Web3 community member. Share relevant OpenALCHI info if it fits. Tweet: "${tweetText}"`
  ];

  const fallbackReplies = [
    `Interesting perspective! 🚀 If you're into AI-powered NFTs, you might like what we're building at OpenALCHI: https://openalchi.xyz`,
    `Great insights! 💡 OpenALCHI is exploring similar ideas with decentralized AI and NFTs. Check it out: https://openalchi.xyz`,
    `Love the Web3 enthusiasm! 🔥 We're working on making NFT creation easier with AI at OpenALCHI: https://openalchi.xyz`,
    `This resonates with our mission at OpenALCHI! We're building tools for creators in the AI-NFT space: https://openalchi.xyz`,
    `Awesome thread! 🙌 If you're interested in the intersection of AI and blockchain, OpenALCHI might be up your alley: https://openalchi.xyz`
  ];

  try {
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    const response = await axios.post(
      config.openRouter.apiUrl,
      {
        model: config.openRouter.model,
        messages: [
          {
            role: 'system',
            content: 'You are a friendly community manager for OpenALCHI. Write helpful, engaging replies that add value to Web3/NFT conversations. Be genuine, not spammy.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://openalchi.xyz',
          'X-Title': 'OpenALCHI Community Bot'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const reply = response.data.choices[0].message.content.trim();
      console.log(`Generated AI reply for @${authorUsername}:`, reply);
      return reply;
    }
  } catch (error) {
    console.error('AI generation failed, using fallback:', error.message);
  }

  // Use fallback if AI fails
  const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  console.log(`Using fallback reply for @${authorUsername}:`, fallback);
  return fallback;
}

async function engageWithCommunity(client) {
  try {
    console.log('\n💬 Starting Community Engagement...');
    console.log('Time:', new Date().toLocaleString());
    
    // Search for relevant tweets to engage with
    const searchQueries = [
      '#NFT #AI -is:retweet -is:reply lang:en',
      '#Web3 #blockchain -is:retweet -is:reply lang:en',
      '#DecentralizedAI -is:retweet -is:reply lang:en',
      'NFT creation tools -is:retweet -is:reply lang:en'
    ];
    
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    console.log('Searching for tweets with query:', query);
    
    try {
      // Get recent tweets (last 24 hours)
      const tweets = await client.v2.search(query, {
        max_results: 10,
        'tweet.fields': ['author_id', 'created_at', 'public_metrics']
      });
      
      if (!tweets.data || tweets.data.data.length === 0) {
        console.log('No tweets found to engage with.');
        return;
      }
      
      let engagementCount = 0;
      const maxEngagements = 3; // Limit daily engagements to avoid spam
      
      for (const tweet of tweets.data.data) {
        if (engagementCount >= maxEngagements) break;
        
        // Skip if tweet is too old (older than 24 hours)
        const tweetAge = Date.now() - new Date(tweet.created_at).getTime();
        if (tweetAge > 24 * 60 * 60 * 1000) continue;
        
        // Get author info
        const author = await client.v2.user(tweet.author_id);
        const authorUsername = author.data.username;
        
        // Skip our own tweets
        if (authorUsername === 'TOpenAlchi') continue;
        
        console.log(`\nFound tweet from @${authorUsername}:`, tweet.text.substring(0, 100) + '...');
        
        // Like the tweet first
        try {
          await client.v2.like(tweet.id);
          console.log('✅ Liked tweet');
        } catch (likeError) {
          console.log('Already liked or unable to like');
        }
        
        // Generate and send reply
        const reply = await generateEngagementResponse(tweet.text, authorUsername);
        
        try {
          await client.v2.reply(reply, tweet.id);
          console.log('✅ Replied to tweet');
          engagementCount++;
          
          // Wait between engagements to appear more natural
          const waitTime = 60000 + Math.random() * 60000; // 1-2 minutes
          console.log(`Waiting ${Math.round(waitTime/1000)} seconds before next engagement...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } catch (replyError) {
          console.error('Failed to reply:', replyError.message);
        }
      }
      
      console.log(`\n✅ Community engagement completed. Engaged with ${engagementCount} tweets.`);
      
    } catch (searchError) {
      console.error('Search failed:', searchError.message);
      if (searchError.code === 429) {
        console.log('Rate limit reached. Will try again later.');
      }
    }
    
  } catch (error) {
    console.error('Community engagement error:', error.message);
  }
}

module.exports = { engageWithCommunity };
