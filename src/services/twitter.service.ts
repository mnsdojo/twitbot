import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';

dotenv.config();

export class TwitterService {
  private client: TwitterApi;

  constructor() {
    const appKey = process.env.TWITTER_APP_KEY || '';
    const appSecret = process.env.TWITTER_APP_SECRET || '';
    const accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    const accessSecret = process.env.TWITTER_ACCESS_SECRET || '';

    this.client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });
  }

  /**
   * Posts a tweet with optional media.
   */
  async postTweet(text: string, mediaIds?: string[]): Promise<boolean> {
    if (process.env.DRY_RUN === 'true') {
      console.log('[DRY RUN] Would post tweet:', text, mediaIds ? `with media: ${mediaIds.join(',')}` : '');
      return true;
    }

    try {
      const response = await this.client.v2.tweet({
        text,
        media: mediaIds ? { media_ids: mediaIds as any } : undefined,
      });
      console.log('Tweet posted successfully:', response.data.id);
      return true;
    } catch (error: any) {
      console.error('Error posting tweet:', error.data || error.message);
      return false;
    }
  }

  /**
   * Uploads media to Twitter and returns the media ID.
   */
  async uploadMedia(filePath: string): Promise<string | null> {
    if (process.env.DRY_RUN === 'true') {
      console.log('[DRY RUN] Would upload media:', filePath);
      return 'fake_media_id';
    }

    try {
      const mediaId = await this.client.v1.uploadMedia(filePath);
      return mediaId;
    } catch (error: any) {
      console.error('Error uploading media:', error.data || error.message);
      return null;
    }
  }

  /**
   * Validates if credentials are set (not necessarily if they are correct).
   */
  hasCredentials(): boolean {
    return !!(
      process.env.TWITTER_APP_KEY &&
      process.env.TWITTER_APP_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    );
  }
}
