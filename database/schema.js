import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const podcastSchema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'podcasts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'image_uri', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'author', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'subscribed', type: 'number' },
        { name: 'likes', type: 'number' },
        { name: 'last_fetched', type: 'number' },
        { name: 'published_date', type: 'number' },
        { name: 'play_date', type: 'number' },
        { name: 'notify', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'index', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'category_podcasts',
      columns: [
        { name: 'category_id', type: 'string' },
        { name: 'podcast_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'episodes',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'image_uri', type: 'string' },
        { name: 'position', type: 'number' },
        { name: 'state', type: 'string' },
        { name: 'podcast_id', type: 'string', isIndexed: true },
        { name: 'author', type: 'string' },
        { name: 'duration', type: 'string' },
        { name: 'played', type: 'boolean' },
        { name: 'content', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'e_index', type: 'number' },
        { name: 'playDate', type: 'number' },
        { name: 'w_id', type: 'number' },
        { name: 'description', type: 'string' },
        { name: 'cachedUrl', type: 'string' },
        { name: 'likes', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'published_date', type: 'number' },
      ],
    }),
  ],
});
