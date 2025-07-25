async function analyzeEngagement(client) {
  try {
    console.log('\n📊 Running Weekly Analytics...');
    console.log('Time:', new Date().toLocaleString());
    
    // Get our own user info
    const me = await client.v2.me();
    const myId = me.data.id;
    const myUsername = me.data.username;
    
    console.log(`Analyzing engagement for @${myUsername}...`);
    
    // Get recent tweets (last 7 days)
    const tweets = await client.v2.userTimeline(myId, {
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics', 'text'],
      exclude: ['retweets', 'replies']
    });
    
    let totalTweets = 0;
    let totalLikes = 0;
    let totalRetweets = 0;
    let totalReplies = 0;
    let totalImpressions = 0;
    let topTweet = null;
    let topEngagement = 0;
    
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for await (const tweet of tweets) {
      // Only count tweets from the last 7 days
      if (new Date(tweet.created_at).getTime() < sevenDaysAgo) continue;
      
      totalTweets++;
      
      if (tweet.public_metrics) {
        const metrics = tweet.public_metrics;
        totalLikes += metrics.like_count || 0;
        totalRetweets += metrics.retweet_count || 0;
        totalReplies += metrics.reply_count || 0;
        totalImpressions += metrics.impression_count || 0;
        
        // Track top performing tweet
        const engagement = (metrics.like_count || 0) + 
                         (metrics.retweet_count || 0) * 2 + 
                         (metrics.reply_count || 0) * 3;
        
        if (engagement > topEngagement) {
          topEngagement = engagement;
          topTweet = tweet;
        }
      }
    }
    
    // Calculate averages
    const avgLikes = totalTweets > 0 ? (totalLikes / totalTweets).toFixed(1) : 0;
    const avgRetweets = totalTweets > 0 ? (totalRetweets / totalTweets).toFixed(1) : 0;
    const avgReplies = totalTweets > 0 ? (totalReplies / totalTweets).toFixed(1) : 0;
    const avgImpressions = totalTweets > 0 ? Math.round(totalImpressions / totalTweets) : 0;
    const engagementRate = totalImpressions > 0 
      ? ((totalLikes + totalRetweets + totalReplies) / totalImpressions * 100).toFixed(2)
      : 0;
    
    // Create analytics report
    const report = `
📊 **Weekly Analytics Report**
Period: Last 7 days
Generated: ${new Date().toLocaleString()}

📈 **Overview:**
- Total Tweets: ${totalTweets}
- Total Impressions: ${totalImpressions.toLocaleString()}
- Engagement Rate: ${engagementRate}%

💖 **Engagement Metrics:**
- Total Likes: ${totalLikes} (avg: ${avgLikes})
- Total Retweets: ${totalRetweets} (avg: ${avgRetweets})
- Total Replies: ${totalReplies} (avg: ${avgReplies})

🏆 **Top Performing Tweet:**
${topTweet ? `"${topTweet.text.substring(0, 100)}..."
Likes: ${topTweet.public_metrics.like_count} | RTs: ${topTweet.public_metrics.retweet_count} | Replies: ${topTweet.public_metrics.reply_count}` : 'No tweets this week'}

💡 **Recommendations:**
${engagementRate < 1 ? '- Consider posting at different times to reach more users' : ''}
${avgReplies < 1 ? '- Ask more questions to encourage discussions' : ''}
${totalTweets < 7 ? '- Increase posting frequency for better visibility' : ''}
${engagementRate > 2 ? '- Great engagement! Keep up the current strategy' : ''}
- Continue using relevant hashtags like #NFT, #Web3, #AI
- Share more visual content for higher engagement
    `;
    
    console.log(report);
    
    // Save analytics to file for tracking
    const fs = require('fs').promises;
    const analyticsDir = 'C:\\Users\\Yano\\Desktop\\Build\\openALCHI\\openalchi-community-agent\\analytics';
    
    try {
      await fs.mkdir(analyticsDir, { recursive: true });
      const filename = `analytics_${new Date().toISOString().split('T')[0]}.txt`;
      await fs.writeFile(`${analyticsDir}\\${filename}`, report);
      console.log(`\n✅ Analytics saved to: analytics\\${filename}`);
    } catch (saveError) {
      console.log('Could not save analytics to file:', saveError.message);
    }
    
    // Optional: Post a summary tweet about weekly performance
    if (engagementRate > 2 && totalTweets >= 5) {
      try {
        const summaryTweet = `📊 Weekly stats: ${totalTweets} tweets reached ${totalImpressions.toLocaleString()} people with ${engagementRate}% engagement rate! Thanks for being part of the OpenALCHI community! 🚀 #Web3 #CommunityLove`;
        await client.v2.tweet(summaryTweet);
        console.log('\n✅ Posted weekly summary tweet');
      } catch (tweetError) {
        console.log('Could not post summary tweet:', tweetError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Analytics error:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
  }
}

module.exports = { analyzeEngagement };
