import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { podcastSchema } from './schema';
import { Podcast } from './models/Podcast.model';
import { Episode } from './models/Episode.model';
import { Category } from './models/Category.model';
import { CategoryPodcasts } from './models/CategoryPodcasts.model';
import migrations from './models/migrations';
// import Post from './model/Post' // ⬅️ You'll import your Models here
// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: podcastSchema,
  // optional database name or file system path
  // dbName: 'myapp',
  // optional migrations
  // migrations,
  // synchronous mode only works on iOS. improves performance and reduces glitches in most cases, but also has some downsides - test with and without it
  // experimental JSI mode, a more advanced version of synchronous: true
  // experimentalUseJSI: true,
  migrations,
  jsi: true,
  // Optional, but you should implement this method:
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
    console.log(error);
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    // Post, // ⬅️ You'll add Models to Watermelon here
    Podcast,
    Episode,
    Category,
    CategoryPodcasts,
  ],
});
