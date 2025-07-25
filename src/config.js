// Configuration file for the OpenALCHI Twitter Bot

module.exports = {
  // OpenRouter Configuration
  openRouter: {
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'gpt-4-turbo', // Available models: gpt-4-turbo, claude-3-opus, claude-3-sonnet, etc.
    maxTokens: 100,
    temperature: 0.8,
    timeout: 10000
  },

  // Tweet Schedule Configuration
  schedule: {
    // Time format: 'minute hour * * *'
    // Examples:
    // '0 9 * * *' = 9:00 AM every day
    // '30 14 * * *' = 2:30 PM every day
    // '0 */4 * * *' = Every 4 hours
    // '0 9,15,21 * * *' = 9 AM, 3 PM, and 9 PM every day
    dailyTweet: '0 9 * * *',
    communityEngagement: '0 11 * * *',
    weeklyAnalytics: '0 8 * * 1' // Every Monday at 8 AM
  },

  // Community Engagement Settings
  engagement: {
    maxDailyEngagements: 3, // Maximum number of tweets to engage with per day
    searchQueries: [
      '#NFT #AI -is:retweet -is:reply lang:en',
      '#Web3 #blockchain -is:retweet -is:reply lang:en',
      '#DecentralizedAI -is:retweet -is:reply lang:en',
      'NFT creation tools -is:retweet -is:reply lang:en'
    ],
    waitBetweenEngagements: {
      min: 60000,  // 1 minute minimum
      max: 120000  // 2 minutes maximum
    }
  },

  // Analytics Settings
  analytics: {
    reportPeriodDays: 7, // Weekly report
    postSummaryTweet: true, // Post a summary tweet if performance is good
    minEngagementRateForSummary: 2, // Minimum engagement rate % to post summary
    minTweetsForSummary: 5 // Minimum tweets in period to post summary
  },

  // Tweet Content Templates
  tweetPrompts: [
    "Generate a tweet about OpenALCHI's NFT creation feature with a link to https://openalchi.xyz.",
    "Generate a tweet promoting a tutorial from https://docs.openalchi.xyz.",
    "Generate a tweet about OpenALCHI's royalty system with a link to https://openalchi.xyz.",
    "Generate a poll about AI-blockchain use cases with hashtags #Web3 #NFTs.",
    "Create an engaging tweet about decentralized AI and OpenALCHI's mission.",
    "Write a tweet highlighting OpenALCHI's IPFS integration for NFT storage.",
    "Generate a tweet about the benefits of AI-powered NFT creation.",
    "Create a tweet inviting developers to contribute to OpenALCHI's open-source project.",
    "Write a tweet about the future of Web3 and how OpenALCHI is contributing to it.",
    "Generate a tweet showcasing a use case for OpenALCHI's platform."
  ],

  // Engagement Reply Prompts
  engagementPrompts: [
    'Reply to this tweet about Web3/NFTs in a friendly, helpful way. Mention OpenALCHI if relevant. Keep it under 280 chars.',
    "Write a supportive reply to this NFT/blockchain tweet. Subtly mention OpenALCHI's features if it fits naturally.",
    'Engage positively with this Web3 community member. Share relevant OpenALCHI info only if appropriate.',
    'Create a thoughtful response that adds value to this Web3 discussion. Mention OpenALCHI only if directly relevant.'
  ],

  // Fallback tweets (used if API fails)
  fallbackTweets: [
    '🚀 Create AI-powered NFTs with OpenALCHI! Start now: https://openalchi.xyz #DecentralizedAI #NFTs',
    "🧪 Learn AI-blockchain integration with OpenALCHI's docs: https://docs.openalchi.xyz #Web3 #OpenSource",
    "💰 Earn royalties with OpenALCHI's platform! Join: https://openalchi.xyz #DeFi #NFTs",
    "What's next for #Web3? A) AI-driven NFTs B) DeFi C) Gaming. Vote: https://openalchi.xyz #DecentralizedAI",
    "🎨 Transform your ideas into NFTs with OpenALCHI's AI tools! https://openalchi.xyz #NFTCommunity #AI",
    '📚 New tutorial: Building decentralized AI apps with OpenALCHI! https://docs.openalchi.xyz #Web3Dev',
    '🌐 IPFS + AI + Blockchain = OpenALCHI. The future of NFTs is here! https://openalchi.xyz #Innovation',
    '🔥 Join the OpenALCHI community and shape the future of AI-powered NFTs! https://openalchi.xyz #Web3Community'
  ],

  // Fallback engagement replies
  fallbackReplies: [
    "Interesting perspective! 🚀 If you're into AI-powered NFTs, you might like what we're building at OpenALCHI.",
    "Great insights! 💡 This aligns with our vision at OpenALCHI for decentralized AI and NFTs.",
    "Love the Web3 enthusiasm! 🔥 We're working on similar ideas at OpenALCHI.",
    "This resonates with our mission! We're building tools for creators in the AI-NFT space.",
    "Awesome thread! 🙌 Your ideas align with what we're exploring at OpenALCHI."
  ],

  // System prompts for AI
  systemPrompt: 'You are a social media manager for OpenALCHI, an innovative AI-blockchain project. Generate short, engaging tweets (280 chars or less) that promote NFT creation, royalties, IPFS integration, or Web3 features. Include relevant hashtags and links. Be enthusiastic but professional, and focus on the value proposition for creators and developers.',
  
  engagementSystemPrompt: 'You are a friendly community manager for OpenALCHI. Write helpful, engaging replies that add value to Web3/NFT conversations. Be genuine, not spammy. Only mention OpenALCHI when directly relevant to the discussion.'
};
