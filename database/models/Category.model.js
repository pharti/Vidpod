import { Model, Q } from '@nozbe/watermelondb';
import { field, writer, lazy } from '@nozbe/watermelondb/decorators';

export class Category extends Model {
  static table = 'categories';

  static associations = {
    category_podcasts: { type: 'has_many', foreignKey: 'category_id' },
  };
  @field('title') title;
  @field('index') index;
  @lazy podcasts = this.collections
    .get('podcasts')
    .query(Q.on('category_podcasts', 'category_id', this.id));
  @writer async addPodcasts(newpodcasts) {
    const podcastsCollection = this.collections.get('podcasts');

    const podcast_ids = newpodcasts.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {},
    );
    const term_ids = Object.keys(podcast_ids);

    const existingPosts = await podcastsCollection
      .query(Q.where('id', Q.oneOf(term_ids)))
      .fetch();
    const existingTermIds = existingPosts.map((c) => c.id);
    const podcastsToCreate = newpodcasts.filter(
      (c) => existingTermIds.indexOf(c.id + '') == -1,
    );
    const podcastsToDelete = existingPosts.filter(
      (c) => term_ids.indexOf(c.id + '') == -1,
    );
    const podcastsToUpdate = existingPosts.filter(
      (c) => term_ids.indexOf(c.id + '') > -1,
    );
    const updatedPodcasts = podcastsToUpdate.map((oldpodcast) =>
      oldpodcast.prepareUpdate((podcast) => {
        podcast.title = podcast_ids[oldpodcast.id].title;
        podcast.imageUri = podcast_ids[oldpodcast.id].image_uri;
        podcast.author = podcast_ids[oldpodcast.id].author;
        podcast.type = podcast_ids[oldpodcast.id].tags;
      }),
    );
    const createdPodcasts = podcastsToCreate.map((newpodcast) =>
      podcastsCollection.prepareCreate((podcast) => {
        podcast.author = newpodcast.author;
        podcast.imageUri = newpodcast.image_uri;
        podcast.description = newpodcast.description;
        podcast.title = newpodcast.title;
        podcast._raw.id = newpodcast.id + '';
        // podcast.subscribed = newpodcast.subscribed;
        podcast.type = newpodcast.tags;
        podcast.likes = newpodcast.likes;
        // podcast.category.set(this);
      }),
    );

    const cp = this.collections.get('category_podcasts');
    const there = await cp
      .query(
        Q.where('category_id', this.id),
        Q.where('podcast_id', Q.oneOf(updatedPodcasts.map((c) => c.id))),
      )
      .fetch();
    const there_ids = there.map((t) => t.podcastId);
    const notthere = updatedPodcasts.filter(
      (t) => there_ids.indexOf(t.id) == -1,
    );

    const self = this;
    //if podcast exists but not in this category add it.
    const cptocreate = notthere.map((podcast) =>
      cp.prepareCreate((cpitem) => {
        cpitem.categoryId = self.id;
        cpitem.podcastId = podcast.id;
      }),
    );
    //podcasts that don't exist also need to be linked to the category
    const cpToCreate = createdPodcasts.map((podcast) =>
      cp.prepareCreate((cpitem) => {
        cpitem.categoryId = self.id;
        cpitem.podcastId = podcast.id;
      }),
    );

    await this.batch(
      ...updatedPodcasts,
      // ...podcastsToDelete.map((oldpodcast) => {
      //   oldpodcast.prepareDestroyPermanently();
      // }),
      ...createdPodcasts,
      ...cpToCreate,
      ...cptocreate,
    );

    // await this.batch(
    //   ...podcasts.map((newpodcast) =>
    //     podcastsCollection.prepareCreate((podcast) => {
    //       podcast.author = newpodcast.author;
    //       podcast.imageUri = newpodcast.image_uri;
    //       podcast.description = newpodcast.description;
    //       podcast.title = newpodcast.title;
    //       // podcast.subscribed = newpodcast.subscribed;
    //       podcast.type = newpodcast.type;
    //       podcast.likes = newpodcast.likes;
    //       podcast.category.set(this);
    //     }),
    //   ),
    // );
  }
}
