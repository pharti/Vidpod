import Realm from 'realm';

// Declare Schema
const CategorySchema = {
  name: 'Category',
  type: 'Category',
  properties: {
    title: 'string',
    index: 'int',
    term_id: 'int',
    podcasts: 'Podcast[]',
  },
  primaryKey: 'term_id',
};
const PodcastSchema = {
  name: 'Podcast',
  type: 'Podcast',

  primaryKey: '_id',

  properties: {
    author: 'string',
    imageUri: 'string',
    description: 'string?',
    title: 'string',
    subscribed: { type: 'bool', default: false },
    type: 'string',
    likes: 'int',
    _id: 'int',
    episodes: 'Episode[]',
    assignee: {
      type: 'linkingObjects',
      objectType: 'Category',
      property: 'podcasts',
    },
  },
};
const EpisodeSchema = {
  name: 'Episode',
  type: 'Episode',
  primaryKey: '_id',
  properties: {
    position: { type: 'int', default: 0 },
    _id: 'int',
    assignee: {
      type: 'linkingObjects',
      objectType: 'Podcast',
      property: 'episodes',
    },
    publishedDate: 'int',
    w_id: 'int',
    author: 'string',
    imageUri: 'string',
    duration: 'string',
    description: 'string',
    played: { type: 'bool', default: false },
    title: 'string',
    url: 'string',
    e_index: 'int',
    playDate: { type: 'int', default: 0 },
    cachedUrl: { type: 'string', default: '' },
    state: { type: 'string', default: 'paused' },
  },
};
// Create realm
let realm = new Realm({
  path: 'test1',
  schema: [EpisodeSchema, PodcastSchema, CategorySchema],
  schemaVersion: 3,
});

// Export the realm
export default realm;
