async function analyzeEngagement(client) {
  try {
    console.log('Fetching user data for TOpenAlchi...');
    const user = await client.v2.userByUsername('TOpenAlchi');
    if (!user.data) {
      throw new Error('User TOpenAlchi not found');
    }
    console.log('Fetching timeline for user ID:', user.data.id);
    const tweets = await client.v2.userTimeline(user.data.id, { max_results: 100 });
    let totalLikes = 0, totalRetweets = 0, totalReplies = 0;

    for await (const tweet of tweets) {
      if (tweet.public_metrics) {
        totalLikes += tweet.public_metrics.like_count || 0;
        totalRetweets += tweet.public_metrics.retweet_count || 0;
        totalReplies += tweet.public_metrics.reply_count || 0;
      }
    }

    console.log(`Engagement Report:
      Total Likes: ${totalLikes}
      Total Retweets: ${totalRetweets}
      Total Replies: ${totalReplies}`);

    await client.v2.sendDmToUser(user.data.id, `Weekly Engagement: ${totalLikes} likes, ${totalRetweets} retweets, ${totalReplies} replies. Optimize posts with more visuals!`);
  } catch (error) {
    console.error('Error analyzing engagement:', error.message);
  }
}

module.exports = { analyzeEngagement };