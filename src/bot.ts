import { AnimeService } from './services/anime.service';
import { TwitterService } from './services/twitter.service';

export class AnimeBot {
  private animeService: AnimeService;
  private twitterService: TwitterService;

  constructor() {
    this.animeService = new AnimeService();
    this.twitterService = new TwitterService();
  }

  /**
   * Main action to fetch a random anime and post it.
   */
  async postRecommendation() {
    console.log('Bot: Getting a new recommendation...');
    const anime = await this.animeService.getRandomAnime();
    
    if (!anime) {
      console.error('Bot: Failed to fetch anime recommendation.');
      return;
    }

    const tweetText = this.animeService.formatTitleForTweet(anime);
    
    console.log('Bot: Attempting to post tweet...');
    const result = await this.twitterService.postTweet(tweetText);
    
    if (result) {
      console.log('Bot: Successfully handled posting.');
    } else {
      console.error('Bot: Failed to handle posting.');
    }
  }

  /**
   * Action to fetch top anime and post one.
   */
  async postTopAnime() {
    console.log('Bot: Fetching top anime...');
    const topAnimeList = await this.animeService.getTopAnime();
    
    if (topAnimeList.length === 0) {
      console.error('Bot: No top anime found.');
      return;
    }

    // Pick a random one from the top 10 for variety
    const randomIndex = Math.floor(Math.random() * topAnimeList.length);
    const anime = topAnimeList[randomIndex];
    const tweetText = `🏆 Trending Top Anime: ${anime.title}\n⭐ Score: ${anime.score}\n\n#anime #trending #topanime\n${anime.url}`;

    await this.twitterService.postTweet(tweetText);
  }

  /**
   * Action to fetch trending anime from Anilist and post.
   */
  async postTrending() {
    console.log('Bot: Fetching trending anime from Anilist...');
    const trending = await this.animeService.getAnilistTrending();

    if (trending.length === 0) {
      console.error('Bot: No trending anime found.');
      return;
    }

    // Pick a random one for variety
    const randomIndex = Math.floor(Math.random() * trending.length);
    const anime = trending[randomIndex];
    const title = anime.title.english || anime.title.romaji;
    const tweetText = `🔥 Trending on Anilist: ${title}\n\nCheck it out: ${anime.siteUrl}\n#anime #trending #anilist`;

    await this.twitterService.postTweet(tweetText);
  }

  /**
   * Action to fetch latest news and post.
   */
  async postNews() {
    console.log('Bot: Fetching latest anime news...');
    const news = await this.animeService.getLatestNews();

    if (news.length === 0) {
      console.error('Bot: No news found.');
      return;
    }

    // Post the most recent news item
    const latestNews = news[0];
    const tweetText = this.animeService.formatNewsForTweet(latestNews);

    await this.twitterService.postTweet(tweetText);
  }

  checkConfig(): boolean {
    if (!this.twitterService.hasCredentials()) {
      console.warn('Bot: WARNING - Twitter credentials are not fully configured in .env');
      return false;
    }
    return true;
  }
}
