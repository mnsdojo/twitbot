import axios from 'axios';
import Parser from 'rss-parser';

export interface Anime {
  mal_id: number;
  title: string;
  url: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    }
  };
  synopsis?: string;
  score?: number;
}

export interface NewsItem {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
}

export class AnimeService {
  private readonly jikanBaseUrl = 'https://api.jikan.moe/v4';
  private readonly anilistUrl = 'https://graphql.anilist.co';
  private rssParser = new Parser();

  /**
   * Fetches the top anime from Jikan.
   */
  async getTopAnime(): Promise<Anime[]> {
    try {
      const response = await axios.get(`${this.jikanBaseUrl}/top/anime?limit=10`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top anime:', error);
      return [];
    }
  }

  /**
   * Fetches latest anime news from Anime News Network RSS.
   */
  async getLatestNews(): Promise<NewsItem[]> {
    try {
      const feed = await this.rssParser.parseURL('https://www.animenewsnetwork.com/all/rss.xml');
      return feed.items.map(item => ({
        title: item.title || 'Untitled News',
        link: item.link || '',
        contentSnippet: item.contentSnippet,
        pubDate: item.pubDate,
      }));
    } catch (error) {
      console.error('Error fetching anime news:', error);
      return [];
    }
  }

  /**
   * Fetches trending anime from Anilist using GraphQL.
   */
  async getAnilistTrending(): Promise<any[]> {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            siteUrl
            description
          }
        }
      }
    `;

    try {
      const response = await axios.post(this.anilistUrl, { query });
      return response.data.data.Page.media;
    } catch (error) {
      console.error('Error fetching Anilist trending:', error);
      return [];
    }
  }

  /**
   * Fetches currently airing seasonal anime.
   */
  async getSeasonalAnime(): Promise<Anime[]> {
    try {
      const response = await axios.get(`${this.jikanBaseUrl}/seasons/now?limit=10`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
      return [];
    }
  }

  /**
   * Fetches random anime.
   */
  async getRandomAnime(): Promise<Anime | null> {
    try {
      const response = await axios.get(`${this.jikanBaseUrl}/random/anime`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching random anime:', error);
      return null;
    }
  }

  /**
   * Formats anime data into a tweetable string.
   */
  formatTitleForTweet(anime: Anime): string {
    const title = anime.title;
    const score = anime.score ? ` ⭐ Score: ${anime.score}` : '';
    const url = anime.url;
    
    return `📺 Anime Recommendation: ${title}\n${score}\n\nCheck it out here: ${url}\n#anime #otaku #animebot`;
  }

  /**
   * Formats news into a tweetable string.
   */
  formatNewsForTweet(news: NewsItem): string {
    return `📰 Anime News Update:\n\n${news.title}\n\nRead more: ${news.link}\n#animenews #anime #automation`;
  }
}
