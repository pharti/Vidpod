import { createSelector, createSlice, Update } from '@reduxjs/toolkit'

export type Updates = {
  homescreen:{latestepisodes:[],categories:[],episodes:[]};
  categories_order:any;
  categories:any;
  terms:{

  };
  feed:number;
}
/**
 * After getting the episodes the old way with the addEpisodes, set a updated variable to now and then next time around get new episodes based off of that date
 * and update the updated variable.
 */
const initialState: Updates = {
   homescreen: {latestepisodes:[],categories:[],episodes:[],
  },
   categories_order:[],
   categories:{},
   terms:{},
   feed: 0
}
const updateSlice = createSlice({
    name: 'update',
    initialState,
    reducers: {
      setFeedDate(state, action) {
        const feed = action.payload;
        state.feed = feed;       
      },
    
      setLatestEpisodes(state,action){
        const latestepisodes = action.payload;
        state.homescreen.latestepisodes = latestepisodes;
      },
      setNewCategories(state,action){
        const categories = action.payload;
        state.homescreen.categories = categories;
      },
      setNewEpisodes(state,action){
        const categories = action.payload;
        state.homescreen.episodes = categories;
      },
      setTermEpisodes(state,action){
        const episodes = action.payload.episodes;
        const term = action.payload.term;
        
        state.terms[term] = episodes;
      },
      setPodcastsForCategory(state,action){
        const podcasts = action.payload.podcasts;
        const category = action.payload.category;
        
        state.categories[category] = podcasts;
      }
    
    }
  })
  export const { setLatestEpisodes,setFeedDate,setTermEpisodes,setNewCategories,setNewEpisodes,setPodcastsForCategory} = updateSlice.actions
  export const updateSelector = (state:{update: Updates}) => state.update;
  export const homeSelector = (state:{update:Updates}) => state.update.homescreen.categories;
  export const ehomeSelector = (state:{update:Updates}) => state.update.homescreen.episodes;

  export const latestepisodesSelector = (state:{update: Updates}) => state.update.homescreen.latestepisodes;
  export default updateSlice.reducer
