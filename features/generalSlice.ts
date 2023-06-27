import {  createSelector, createSlice } from '@reduxjs/toolkit'
export interface generalState {
    error: string;
    loading: boolean;
    playSpeed:number;
    fetchingnew: boolean;
    syncing: boolean;
    toast:string | null;
    filter: 'all' | 'downloaded';
}
const initialState: generalState = {
    error: "",
    loading: false,
    playSpeed:1,
    fetchingnew: false,
    syncing: false,
    toast: null,
    filter: 'all'
}
const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
      setError(state, action) {
        const error = action.payload
        state.error = error;
      },
      setLoading(state,action){
          const loading = action.payload;
          state.loading = loading;
      }, 
      setFetchingNew(state,action){
        const fetching = action.payload;
        state.fetchingnew = fetching;
      },
      setSyncing(state,action){
        state.syncing = action.payload;
      },
      setToast(state,action){
        state.toast = action.payload;
      },
      setFilter(state,action){
        state.filter = action.payload;
      }
    }
  })
  export default generalSlice.reducer
  export const generalSelector = (state:{general: generalState}) => state.general;
  export const fetchingnewSelector = (state:{general: generalState}) => state.general.fetchingnew;
  export const toastSelector = (state:{general: generalState}) => state.general.toast;
  export const filterSelector = (state:{general: generalState}) => state.general.filter;

export const {setLoading, setError,setFetchingNew,setSyncing,setToast,setFilter} = generalSlice.actions;
  