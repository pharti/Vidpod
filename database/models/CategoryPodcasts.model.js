import { Model } from '@nozbe/watermelondb';

import { field } from '@nozbe/watermelondb/decorators';

export class CategoryPodcasts extends Model {
  static table = 'category_podcasts';
  static associations = {
    podcasts: { type: 'belongs_to', key: 'podcast_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
  };
  @field('podcast_id') podcastId;
  @field('category_id') categoryId;
}
