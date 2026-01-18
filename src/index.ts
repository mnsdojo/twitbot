import * as dotenv from 'dotenv';
import { AnimeBot } from './bot';
import { setupScheduler } from './scheduler';

dotenv.config();

async function main() {
  console.log('--- Anime Twitter Bot Starting ---');

  const bot = new AnimeBot();

  // Check if credentials are set
  if (!bot.checkConfig()) {
    console.log('Bot is starting in DRY RUN mode or is missing credentials.');
    console.log('Please check your .env file.');
  }

  // Setup scheduling
  setupScheduler(bot);

  // Optional: Run one post immediately on startup for testing
  // console.log('Bot: Running initial post...');
  // await bot.postRecommendation();

  console.log('Bot is now running and scheduled.');
}

main().catch((err) => {
  console.error('Fatal error in main loop:', err);
  process.exit(1);
});
