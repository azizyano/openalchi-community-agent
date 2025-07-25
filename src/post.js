const axios = require('axios');
const config = require('./config');

async function generatePost() {
  // Select a random prompt from the configuration
  const prompt = config.tweetPrompts[Math.floor(Math.random() * config.tweetPrompts.length)];

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Calling OpenRouter API - Attempt ${attempt}...`);
      console.log(`Using model: ${config.openRouter.model}`);
      console.log(`Prompt: ${prompt}`);

      const response = await axios.post(
        config.openRouter.apiUrl,
        {
          model: config.openRouter.model,
          messages: [
            {
              role: 'system',
              content: config.systemPrompt
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: config.openRouter.maxTokens,
          temperature: config.openRouter.temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://openalchi.xyz',
            'X-Title': 'OpenALCHI Tweet Bot'
          },
          timeout: config.openRouter.timeout
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        const tweet = response.data.choices[0].message.content.trim();
        
        // Ensure tweet is within character limit
        if (tweet.length > 280) {
          console.log('Tweet too long, truncating...');
          return tweet.substring(0, 277) + '...';
        }
        
        console.log('Generated tweet:', tweet);
        console.log(`Tweet length: ${tweet.length} characters`);
        return tweet;
      } else {
        throw new Error('Invalid response structure from OpenRouter');
      }

    } catch (error) {
      console.error(`OpenRouter Error (Attempt ${attempt}):`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      if (attempt === 3) {
        // Use a random fallback tweet
        const fallback = config.fallbackTweets[Math.floor(Math.random() * config.fallbackTweets.length)];
        console.log('Using fallback tweet:', fallback);
        return fallback;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function postDailyTweet(client) {
  try {
    const tweet = await generatePost();
    
    console.log('\nPosting tweet to Twitter...');
    const result = await client.v2.tweet(tweet);
    
    console.log('✅ Successfully posted tweet!');
    console.log('Tweet content:', tweet);
    console.log('Tweet ID:', result.data.id);
    console.log('Tweet URL:', `https://twitter.com/i/web/status/${result.data.id}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error posting tweet:', error.message);
    if (error.data) {
      console.error('Twitter API Error:', JSON.stringify(error.data, null, 2));
    }
    throw error;
  }
}

module.exports = { postDailyTweet, generatePost };
