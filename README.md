# OpenALCHI Twitter Bot

An automated Twitter bot for the OpenALCHI project that uses OpenRouter AI to generate and post daily tweets about AI-blockchain integration, NFTs, and Web3.

## Features

- 🤖 AI-powered tweet generation using OpenRouter API
- 📅 Scheduled daily tweets at customizable times
- 💬 Community engagement features
- 📊 Weekly analytics tracking
- 🔄 Automatic retry with fallback tweets
- ⚙️ Easy configuration through config.js

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API keys in `.env`:**
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `X_API_KEY`: Twitter API key
   - `X_API_SECRET`: Twitter API secret
   - `X_ACCESS_TOKEN`: Twitter access token
   - `X_ACCESS_TOKEN_SECRET`: Twitter access token secret

3. **Configure the bot in `src/config.js`:**
   - Choose your preferred AI model
   - Set tweet scheduling times
   - Customize tweet prompts
   - Add fallback tweets

## Usage

### Start the bot:
```bash
npm start
```

### Send a manual tweet (while bot is running):
Press `Ctrl+T`

### Configuration Options

Edit `src/config.js` to customize:

- **AI Model**: Change `openRouter.model` to any model available on OpenRouter (e.g., 'gpt-4-turbo', 'claude-3-opus', etc.)
- **Tweet Schedule**: Modify `schedule.dailyTweet` using cron format:
  - `'0 9 * * *'` = 9:00 AM daily
  - `'30 14 * * *'` = 2:30 PM daily
  - `'0 */4 * * *'` = Every 4 hours
  - `'0 9,15,21 * * *'` = 9 AM, 3 PM, and 9 PM daily

### Schedule Format

The schedule uses cron syntax: `minute hour day month weekday`
- minute: 0-59
- hour: 0-23
- day: 1-31
- month: 1-12
- weekday: 0-7 (0 and 7 are Sunday)

Use `*` for "any value" and `*/n` for "every n units"

## Available OpenRouter Models

Some popular models you can use:
- `gpt-4-turbo` - OpenAI GPT-4 Turbo
- `gpt-3.5-turbo` - OpenAI GPT-3.5 Turbo
- `claude-3-opus` - Anthropic Claude 3 Opus
- `claude-3-sonnet` - Anthropic Claude 3 Sonnet
- `mistral-large` - Mistral Large
- `llama-3-70b` - Meta Llama 3 70B

Check [OpenRouter's model list](https://openrouter.ai/models) for all available models and pricing.

## Monitoring

The bot provides detailed logging:
- ✅ Successful operations
- ❌ Errors with detailed messages
- 📅 Schedule information
- 🚀 Tweet posting confirmations
- 📍 Next scheduled tweet time

## Troubleshooting

1. **OpenRouter API errors:**
   - Check your API key is correct
   - Verify you have credits on OpenRouter
   - Try a different model if one isn't working

2. **Twitter API errors:**
   - Ensure all Twitter credentials are correct
   - Check if your app has read/write permissions
   - Verify your Twitter account isn't restricted

3. **Scheduling issues:**
   - Check the server time matches your expected timezone
   - Verify the cron syntax in config.js

## Safety Features

- Automatic retries (3 attempts) before using fallback tweets
- Character limit enforcement (280 chars)
- Graceful error handling
- Fallback tweets when API fails

## License

This project is part of the OpenALCHI ecosystem.
