import { Model, Q } from '@nozbe/watermelondb';
import {
  field,
  relation,
  children,
  writer,
  lazy,
} from '@nozbe/watermelondb/decorators';

export class Podcast extends Model {
  static table = 'podcasts';

  static associations = {
    episodes: { type: 'has_many', foreignKey: 'podcast_id' },
    category_podcasts: { type: 'has_many', foreignKey: 'podcast_id' },
  };
  @field('author')
  author;
  @field('image_uri')
  imageUri;
  @field('description')
  description;
  @field('title')
  title;
  @field('subscribed')
  subscribed;
  @field('type')
  type;
  @field('likes')
  likes;
  @field('published_date')
  publishedDate;
  @field('last_fetched')
  lastFetched;
  @field('play_date')
  playDate;
  @field('notify')
  notify;
  @children('episodes') episodes;
  @relation('categories', 'category_id')
  category;

  @lazy
  categories = this.collections
    .get('categories')
    .query(Q.on('category_podcasts', 'podcast_id', this.id));
  @lazy latestepisode = this.collections
    .get('episodes')
    .query(
      Q.where('podcast_id', this.id),
      Q.where('published_date', Q.gt(this.subscribed)),
      Q.sortBy('published_date', Q.desc),
      Q.take(1),
    );
  @writer async subscribe() {
    await this.update((r) => {
      r.subscribed = new Date().getTime() / 1000;
    });
  }
  @writer async unsubscribe() {
    await this.update((r) => {
      r.subscribed = 0;
    });
  }
  @writer async addEpisodes(newepisodes) {
    const podcast_id = this.id;
    const podcastsCollection = this.collections.get('episodes');
    const podcast_ids = newepisodes
      .filter((e) => e.podcast_id == podcast_id)
      .reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
    const existingPosts = await this.episodes.fetch();
    const term_ids = Object.keys(podcast_ids);
    const existingTermIds = existingPosts.map((c) => c.wId);

    const podcastsToCreate = newepisodes.filter(
      (c) => existingTermIds.indexOf(parseInt(c.id)) == -1,
    );
    // const podcastsToDelete = existingPosts.filter((c) => {
    //   return term_ids.indexOf(c.wId) == -1;
    // });

    const podcastsToUpdate = existingPosts.filter(
      (c) => term_ids.indexOf('' + c.wId) > -1,
    );
    const self = this;

    await this.batch(
      ...podcastsToUpdate.map((oldpodcast) =>
        oldpodcast.prepareUpdate((podcast) => {
          podcast.title = podcast_ids[oldpodcast.wId].title;
          podcast.imageUri = podcast_ids[oldpodcast.wId].image_uri;
          podcast.author = podcast_ids[oldpodcast.wId].author;
          podcast.duration = podcast_ids[oldpodcast.wId].duration;
          podcast.eIndex = parseInt(podcast_ids[oldpodcast.wId].e_index);
          podcast.url = podcast_ids[oldpodcast.wId].url;
          podcast.publishedDate = parseInt(
            podcast_ids[oldpodcast.wId].published_date,
          );
        }),
      ),
      // ...podcastsToDelete.map((oldpodcast) => {
      //   oldpodcast.prepareDestroyPermanently();
      // }),
      ...podcastsToCreate.map((newpodcast) =>
        podcastsCollection.prepareCreate((podcast) => {
          podcast.author = newpodcast.author;
          podcast.imageUri = newpodcast.image_uri;
          podcast.description = newpodcast.description;
          podcast.title = newpodcast.title;
          podcast.wId = parseInt(newpodcast.id);
          podcast._raw.id = 'e' + newpodcast.id;
          podcast.eIndex = parseInt(newpodcast.e_index);
          podcast.publishedDate = parseInt(newpodcast.published_date);
          podcast.duration = newpodcast.duration;
          podcast.url = newpodcast.url;
          podcast.podcast.set(self);
        }),
      ),
    );
  }
}
