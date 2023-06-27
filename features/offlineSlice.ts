import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
export interface offlineState {
  subscribed: Array<string>;
  unsubscribed: Array<string>;
  notified: Array<string>;
  unnotified: Array<string>;
  terms: Object;
}
const initialState: offlineState = {
  subscribed: [],
  unsubscribed: [],
  notified: [],
  unnotified: [],
    terms: {}
};
const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addSubscribed(state, action) {
      const s = action.payload;
      const index = state.unsubscribed.indexOf(s);

      if (index >= 0) {
        state.unsubscribed.splice(index, 1);
      } else {
        if (state.subscribed.indexOf(s) < 0) {
          state.subscribed.push(s);
        }
      }
    },
    addUnsubscribed(state, action) {
      const s = action.payload;
      const index = state.subscribed.indexOf(s);

      if (index >= 0) {
        state.subscribed.splice(index, 1);
      } else {
        if (state.unsubscribed.indexOf(s) < 0) {
          state.unsubscribed.push(s);
        }
      }
    },
    removeSubscribed(state, action) {
      const s = action.payload;
      const index = state.subscribed.indexOf(s);
      if (index > -1) {
        state.subscribed.splice(index, 1);
      }
    },
    removeUnsubscribed(state, action) {
      const s = action.payload;
      const index = state.unsubscribed.indexOf(s);
      if (index > -1) {
        state.unsubscribed.splice(index, 1);
      }
    },
    clearSubscribed(state, action) {
      state.subscribed = [];
    },
    clearUnsubscribed(state, action) {
      state.unsubscribed = [];
    },
    setTerms(state,action){
      state.terms = action.payload;
    }
  },
});
export default offlineSlice.reducer;
export const offlineSelector = (state: { offline: offlineState }) =>
  state.offline;
  
export const {
  addSubscribed,
  removeSubscribed,
  addUnsubscribed,
  removeUnsubscribed,
  clearSubscribed,
  clearUnsubscribed,
  setTerms
} = offlineSlice.actions;
