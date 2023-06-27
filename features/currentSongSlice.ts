import {  createAsyncThunk, createSelector, createSlice, Dispatch } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { Episode, selectById } from './episodesSlice';
import { selectById as selectPodcastById } from "./podcastsSlice";
import TrackPlayer from 'react-native-track-player';
import { addTrack } from '../js/trackFunctions';
type CurrentSong = {
  episode_id:string;
  updated:"position"|"isplaying"|"";
  isplaying: boolean;
  sliding: boolean;
  position: number;
  show:boolean;
  podcast_id: string;
  playSpeed: number;
  status:"playing"|"paused"|"buffering";
}
const initialState: CurrentSong = {
   episode_id:"",
   isplaying: false,
  updated: "",
  show: true,
  playSpeed: 1,
  position: 0,
  sliding: false,
  status:"paused",
  podcast_id: ""
}
const currentSongSlice = createSlice({
    name: 'currentSong',
    initialState,
    reducers: {
      setCurrentSong(state, action) {
        // state.username = username;
        // state.loggedIn = true;
        const episode = action.payload.episode_id;

        const podcast = action.payload.podcast_id;
        // if(state.episode_id == episode){
        //   state.updated = 'isplaying';

        // }
        state.episode_id = episode;
        state.podcast_id = podcast;

        
      },
   
      // setPosition(state,action){
      //   state.episode.position = action.payload;

      // },
      setUpdated(state,action){
        const updated = action.payload;
        state.updated = updated;
      },
      setStatus(state,action){
        const status = action.payload;
        state.status = status;
      },
      setShow(state,action){
        const show = action.payload;
        state.show = show;
      },
      setPlaySpeed(state,action){
        const playSpeed = action.payload;
        state.playSpeed = playSpeed;
      },
      setPosition(state,action){
        const position = action.payload;
        if(!state.sliding){
          state.position = position;
        }
      },
      setValuePosition(state,action){
        const position = action.payload;
        // if(!state.sliding){
        state.position = position;
        // }
      },
      setSliding(state,action){
        const sliding = action.payload;
        state.sliding = sliding;
      }
    }
  })
  export const { setCurrentSong,setPosition,setValuePosition,setUpdated,setShow,setPlaySpeed,setSliding,setStatus} = currentSongSlice.actions

  export const currentSongSelector = (state:{currentSong: CurrentSong}) => state.currentSong;

  // export const positionSelector = createSelector([currentSongSelector],(res)=> res.episode.position);
  // export const isplayingSelector = createSelector([currentSongSelector],(res)=> res.isplaying);
  export const episodeIdSelector = createSelector([currentSongSelector], (res)=> {

      
    return res.episode_id
  });
  export const updatedSelector = createSelector([currentSongSelector],(res)=> res.updated);
  export const showSelector = createSelector([currentSongSelector],(res)=> res.show);
  export const playSpeedSelector = createSelector([currentSongSelector],(res)=> res.playSpeed);
  export const positionSelector = createSelector([currentSongSelector],(res)=>res?.position);
  export const statusSelector = createSelector([currentSongSelector],(res)=>res?.status);
  export const episodeSelector = createSelector([currentSongSelector],(res)=>res?.episode_id);
  export const podcastSelector = createSelector([currentSongSelector],(res)=>res?.podcast_id);

// export const widgetSelector = createSelector([currentSongSelector],(res)=> {status: res?.status,})
// export const setNewPosition = createAsyncThunk(
//   'current/position',
//   async (position: number, thunkApi) => {
//     const newposition = thunkApi.getState().currentSong;
//     console.log(thunkApi.getState())
//     thunkApi.dispatch(setPosition(currentSong.position+1))
//   });
   

  export default currentSongSlice.reducer
