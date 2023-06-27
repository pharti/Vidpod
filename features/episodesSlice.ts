import {  createAsyncThunk, createEntityAdapter, createSelector, createSlice,Dispatch} from '@reduxjs/toolkit'
import TrackPlayer from 'react-native-track-player';
import { Podcast } from '../database/models/Podcast.model';
import { setLoading } from './generalSlice';

export type Episode = {
    position: number;
    id: string;
    podcast_id: number;
    published_date:string;
    author:string;
    image_uri:string;
    duration:string;
    played:boolean;
    description:string;
    title:string;
    content:string;
    url:string;
    e_index:number;
    playDate:number;
    cachedUrl:string | null;
    state: 'playing' | 'paused' | 'buffering';
}
const EPISODE_DEFAULTS = {
  position: 0,
  played:false,
  playDate:0,
  state: 'paused',
  cachedUrl: null
}
const episodeAdapter = createEntityAdapter<Episode>({
    sortComparer:(a,b)=>{
     return b.e_index - a.e_index
    }
})

const episodesSlice = createSlice({
    name: 'episodes',
    initialState:episodeAdapter.getInitialState(),
    reducers: {
      addEpisode:episodeAdapter.addOne,
      updateEpisode:episodeAdapter.updateOne,
      removeEpisode: episodeAdapter.removeOne,
      addEpisodes:(state,action)=>{
        const episodes = action.payload.map((e:Episode) => {
          return({ ...EPISODE_DEFAULTS, ...e,id: e.podcast_id+"-"+e.e_index})
        }
          );
        episodeAdapter.upsertMany(state,episodes);
      },
      updateEpisodes:(state,action)=>{
        const episodes = action.payload.map((e:Episode) => {
          return({ ...e,id: e.podcast_id+"-"+e.e_index})
        });
        episodeAdapter.updateMany(state,episodes); 
      }
      


      
    }
  })
  export default episodesSlice.reducer
export  const {addEpisodes,updateEpisode,addEpisode,updateEpisodes,removeEpisode} = episodesSlice.actions;
export const {selectAll:selectAllEpisodes,selectById,selectEntities,selectIds,selectTotal} = episodeAdapter.getSelectors((state:any)=> state.episodes);
export const episodeInfoSelector = createSelector([selectById],(res)=>({
    author:res?.author,
    title: res?.title,
    image_uri:res?.image_uri,
    duration: res?.duration,
    podcast_id: res?.podcast_id,
    published_date:res?.published_date,
    id:res?.id,
    e_index:res?.e_index,
    url: res?.url,
    playDate:res?.playDate,
    state: res?.state,
    cachedUrl: res?.cachedUrl
  }));
  export const positionSelector = createSelector([selectById],(res)=>res?.position);
  const podcastidSelector = createSelector([selectById],(res) => res?.podcast_id); 
  export const episodesLengthSelector = createSelector([selectAllEpisodes,selectById],(episodes,episode)=>{
    return episodes.filter(e => e.podcast_id == episode?.podcast_id).length
  });

  export const addEpisodesFromFeed = createAsyncThunk ('episodes/fetch',async (podcastInfo:{podcast_id:number, check_date:number,how: string},thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    //TODO change the url, if website url changes
    fetch("https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id="+podcastInfo.podcast_id+"&published_date="+podcastInfo.check_date+"&how="+podcastInfo.how,
    {headers:{"Cache-control":'no-cache'},cache:'no-cache'}).then(response => response.json()).then((response) => {
        const podcasts = response;
        thunkApi.dispatch(addEpisodes(podcasts));
        thunkApi.dispatch(setLoading(false));

      }).catch(error => {
            // thunkApi.dispatch(setLoading(false));c\\
            // console.log(error);
            // thunkApi.dispatch(setError(error.response.data.message));
        });
    }); 
    export const updateEpisodesFromFeed = createAsyncThunk ('episodes/fetch',async (podcastInfo:{podcast_id:number, check_date:number,how: string},thunkApi) => {
      thunkApi.dispatch(setLoading(true));
      //TODO change the url, if website url changes
      fetch("https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id="+podcastInfo.podcast_id+"&published_date="+podcastInfo.check_date+"&how="+podcastInfo.how,
      {headers:{"Cache-control":'no-cache'},cache:'no-cache'}).then(response => response.json()).then((response) => {
          const podcasts = response;
          thunkApi.dispatch(addEpisodes(podcasts));
          thunkApi.dispatch(setLoading(false));
  
        }).catch(error => {
              // thunkApi.dispatch(setLoading(false));c\\
              // console.log(error);
              // thunkApi.dispatch(setError(error.response.data.message));
          });
      }); 
      export const getNewEpisodes = createAsyncThunk('newepisodes/fetch',async(podcasts:Array<Podcast>)=>{
        const query = podcasts.map(podcast=> "(podcast_id = "+podcast.id+" AND published_date > "+podcast.subscribed*100+")").join(" OR ");
        fetch("https://yidpod.com/wp-json/yidpod/v1/new-episodes?where="+query,{cache:'no-cache'}).then((response)=>response.json()).then((episodes)=>{
        }).catch(error=>{})
      })