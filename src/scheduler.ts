import cron from 'node-cron';
import { AnimeBot } from './bot';

export function setupScheduler(bot: AnimeBot) {
  console.log('Scheduler: Setting up cron jobs...');

  // 1. Post a random recommendation every 8 hours
  cron.schedule('0 */8 * * *', async () => {
    console.log('Cron: Triggering seasonal recommendation...');
    await bot.postRecommendation();
  });

  // 2. Post trending from Anilist every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('Cron: Triggering trending post...');
    await bot.postTrending();
  });

  // 3. Post news updates every 4 hours if available
  cron.schedule('0 */4 * * *', async () => {
    console.log('Cron: Triggering news update...');
    await bot.postNews();
  });

  // 3. Keep-alive log every hour
  cron.schedule('0 * * * *', () => {
    console.log(`Cron: Bot is active - ${new Date().toISOString()}`);
  });

  console.log('Scheduler: Cron jobs scheduled.');
}
