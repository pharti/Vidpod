import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { writer } from '@nozbe/watermelondb/decorators/action';

export class Episode extends Model {
  static table = 'episodes';

  static associations = {
    podcasts: { type: 'belongs_to', key: 'podcast_id' },
  };
  @field('position')
  position;
  @field('id')
  id;
  @relation('podcasts', 'podcast_id')
  podcast;
  @field('published_date')
  publishedDate;
  @field('author')
  author;
  @field('image_uri')
  imageUri;
  @field('duration')
  duration;
  @field('description')
  description;
  @field('played')
  played;
  @field('title')
  title;
  @field('url')
  url;
  @field('e_index')
  eIndex;
  @field('playDate')
  playDate;
  @field('cachedUrl')
  cachedUrl;
  @field('state')
  state;
  @field('w_id')
  wId;

  @writer async playing() {
    await this.update(episode => {
      // episode.state = newstate;
      // if (newstate == 'playing') {
      episode.playDate = new Date().getTime();
      // }
    });
    const podcast = await this.database.get('podcasts').find(this.podcast.id);
    await podcast.update(p => {
      p.playDate = new Date().getTime();
    });
  }
  @writer async updatePosition(newposition) {
    await this.update(episode => {
      episode.position = newposition;
      episode.playDate = new Date().getTime();
    });
  }
  @writer async updateCachedUrl(newcacheurl) {
    await this.update(episode => {
      episode.cachedUrl = newcacheurl;
    }).catch(error => console.log(error));
  }
  @writer async paused(position) {
    await this.update(episode => {
      episode.position = position;
      episode.state = 'paused';
    });
  }
  // @writer async update(newcacheurl) {
  //   await this.update((episode) => {
  //     episode.cachedUrl = newcacheurl;
  //   });
  // }
  // @writer async updatePosition(newposition) {
  //   await this.update((episode) => {
  //     episode.position = newposition;
  //   });
  // }
}
