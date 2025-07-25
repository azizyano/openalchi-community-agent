const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

async function analyzeEngagement() {
  try {
    const user = await client.v2.userByUsername('TOpenAlchi');
    const tweets = await client.v2.userTimeline(user.data.id, { max_results: 100 });
    let totalLikes = 0, totalRetweets = 0, totalReplies = 0;

    for await (const tweet of tweets) {
      totalLikes += tweet.public_metrics.like_count;
      totalRetweets += tweet.public_metrics.retweet_count;
      totalReplies += tweet.public_metrics.reply_count;
    }

    console.log(`Engagement Report:
      Total Likes: ${totalLikes}
      Total Retweets: ${totalRetweets}
      Total Replies: ${totalReplies}`);

    await client.v2.sendDmToUser(user.data.id, `Weekly Engagement: ${totalLikes} likes, ${totalRetweets} retweets, ${totalReplies} replies. Optimize posts with more visuals!`);
  } catch (error) {
    console.error('Error analyzing engagement:', error);
  }
}

module.exports = { analyzeEngagement };