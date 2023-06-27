import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { selectAllEpisodes } from './episodesSlice';
import { userSelector } from './userSlice';

export type Podcast = {
  id: number;
  image_uri: string;
  type: string;
  author: string | undefined;
  subscribed: number;
  title: string;
  likes: number;
  updated_at: number;
  feedlink: string;
  artistsHeadline: string;
  episodesCount: number;
};
const podcastsAdapter = createEntityAdapter<Podcast>({
  selectId: (podcast) => podcast.id,
});

const podcastsSlice = createSlice({
  name: 'podcasts',
  initialState: podcastsAdapter.getInitialState(),
  reducers: {
    updatePodcast: podcastsAdapter.updateOne,
    upsertPodcast: podcastsAdapter.upsertOne,
    resetPodcasts: podcastsAdapter.updateMany,
    removePodcast: podcastsAdapter.removeOne,
    removeAllPodcasts: (state, action) => {
      const user = useSelector(userSelector);
      const ids = Object.keys(state.entities);
      const podcasts = ids.filter(
        (p) => state.entities[p].subscribed && state.entities[p].subscribed > 0,
      );
  
      if (podcasts.length > 0 && action.payload.access_token) {
        if (user.expires_in >= new Date().getTime()) {
          fetch(`https://yidpod.com/wp-json/yidpod/v1/sync?type=podcasts`, {
            method: 'POST',
            body: JSON.stringify(podcasts),
            headers: { Authorization: 'Basic ' + user.access_token },
          })
            .then((response) => {
              if (response.ok) {
                podcastsAdapter.removeAll(state);
              }
            })
            .catch((error) => {});
        }
      }
    },
  },
});
export default podcastsSlice.reducer;
export const {
  updatePodcast,
  upsertPodcast,
  resetPodcasts,
  removePodcast,
  removeAllPodcasts,
} = podcastsSlice.actions;
export const {
  selectAll: selectAllPodcasts,
  selectById,
  selectEntities,
  selectIds,
  selectTotal,
} = podcastsAdapter.getSelectors((state: any) => state.podcasts);
