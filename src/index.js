require('dotenv').config();
const schedule = require('node-schedule');
const { TwitterApi } = require('twitter-api-v2');
const { postDailyTweet } = require('./post');
const { engageWithCommunity } = require('./engage');
const { analyzeEngagement } = require('./Analytics');

// Verificar claves
console.log('API Key:', process.env.X_API_KEY ? 'Loaded' : 'Missing');
console.log('DeepSeek API Key:', process.env.DEEPSEEK_API_KEY ? 'Loaded' : 'Missing');

// Inicializar cliente
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

// Pruebas inmediatas para verificar funcionalidad
async function runTests() {
  try {
    console.log('Testing daily tweet...');
    await postDailyTweet(client);

    console.log('Testing community engagement...');
    await engageWithCommunity(client);

    console.log('Testing analytics...');
    await analyzeEngagement(client);
  } catch (error) {
    console.error('Test error:', error.message);
  }
}
runTests();

// Programar tweet diario a las 10 AM +01:00 (9 AM UTC)
schedule.scheduleJob('0 9 * * *', () => {
  console.log('Running daily tweet task...');
  postDailyTweet(client).catch(error => console.error('Daily tweet error:', error.message));
});

// Programar interacción comunitaria a las 12 PM +01:00 (11 AM UTC)
schedule.scheduleJob('0 11 * * *', () => {
  console.log('Running community engagement task...');
  engageWithCommunity(client).catch(error => console.error('Engagement error:', error.message));
});

// Programar análisis semanal los lunes a las 9 AM +01:00 (8 AM UTC)
schedule.scheduleJob('0 8 * * 1', () => {
  console.log('Running weekly analytics task...');
  analyzeEngagement(client).catch(error => console.error('Analytics error:', error.message));
});

console.log('OpenALCHI Community Agent is running...');