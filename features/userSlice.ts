import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import { setLoading, setError } from './generalSlice';
import { updatePodcast, upsertPodcast } from './podcastsSlice';
import { refreshToken } from '../js/helpers';
import DeviceInfo from 'react-native-device-info';

import {
  addSubscribed,
  addUnsubscribed,
  clearSubscribed,
  clearUnsubscribed,
} from './offlineSlice';
import { Platform } from 'react-native';
export interface userState {
  wp_user: object;
  loggedIn: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: Number;
  skip: boolean;
  notification_token: string;
}
const initialState: userState = {
  wp_user: {},
  loggedIn: false,
  access_token: '',
  expires_in: 0,
  refresh_token: '',
  skip: false,
  notification_token: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWpUser(state, action) {
      if (action.payload) {
        const { wp_user, access_token, refresh_token, expires_in } =
          action.payload;
        // state.username = username;
        // state.loggedIn = true;
        if (access_token != '') {
          state.wp_user = wp_user;
          state.access_token = access_token;
          state.refresh_token = refresh_token;
          state.expires_in = expires_in * 1000 + new Date().getTime();
          state.loggedIn = true;
        }
      } else {
        state.wp_user = initialState.wp_user;
        state.access_token = initialState.access_token;
        state.refresh_token = initialState.refresh_token;
        state.expires_in = initialState.expires_in;
        state.loggedIn = initialState.loggedIn;
        state.notification_token = initialState.notification_token;
      }
    },
    setRefreshToken(state, action) {
      const { access_token, expires_in } = action.payload;
      state.access_token = access_token;
      state.expires_in = expires_in * 1000 + new Date().getTime();
   
    },
    setSkip(state, action) {
      const skip = action.payload;
      state.skip = skip;
    },
    logout(state, action) {
      state.wp_user = {};
    },
    setNotificationToken(state, action) {
      const token = action.payload;
      state.notification_token = token;
    },
  },
});

//Export user variable so it can be used in components.
export const userSelector = (state: { user: userState }) => state.user;

//Export the reducer so it can be added to the store in App.tsx;
export default userSlice.reducer;
/*
  Login user function. Extract the actions from the userSlice above.
*/
export const {
  setWpUser,
  logout,
  setSkip,
  setRefreshToken,
  setNotificationToken,
} = userSlice.actions;
export const loginUser = createAsyncThunk(
  'user/login',
  async (userInfo: { username: string; password: string }, thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    //TODO change the url, if website url changes
    axios
      .post(
        'https://yidpod.com/wp-json/api-bearer-auth/v1/login',
        JSON.stringify({
          username: userInfo.username.replace(/\s/g, ''),
          password: userInfo.password,
          client_name: Platform.OS + DeviceInfo.getUniqueId(),
        }),
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' } },
      )
      .then((response) => {
        thunkApi.dispatch(setWpUser(response.data));
        thunkApi.dispatch(setLoading(false));
      })
      .catch((error) => {
        thunkApi.dispatch(setLoading(false));
        console.log(error);
        thunkApi.dispatch(setError(error.response.data.code));
      });
  },
);
export const passwordForgot = createAsyncThunk(
  'user/forgot',
  async (userInfo: { username: string; }, thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    //TODO change the url, if website url changes
    console.log(userInfo.username);
    let data = new FormData();
   

    data.append('user_login', userInfo.username);
    data.append('client_name',Platform.OS + DeviceInfo.getUniqueId());
    axios
      .post(
        'https://yidpod.com/wp-login.php?action=lostpassword',
       data,
        { headers: {   'Content-Type': 'multipart/form-data; charset=UTF-8','Accept': 'application/json'} }
      )
      .then((response) => {
        // thunkApi.dispatch(setWpUser(response.data));
        thunkApi.dispatch(setLoading(false));
      })
      .catch((error) => {
        thunkApi.dispatch(setLoading(false));
        // console.log(error);
        thunkApi.dispatch(setError(error.response.data.code));
      });
  },
);
export const registerUser = createAsyncThunk(
  'user/register',
  async (userInfo: { password: string; email: string }, thunkApi) => {
    thunkApi.dispatch(setLoading(true));
    //TODO change the url, if website url changes
    axios
      .post(
        'https://yidpod.com/wp-json/wp/v2/users/register',
        JSON.stringify({
          username: userInfo.email.replace(/\s/g, ''),
          email: userInfo.email.replace(/\s/g, ''),
          password: userInfo.password,
        }),
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' } },
      )
      .then((response) => {
        thunkApi.dispatch(
          loginUser({
            username: userInfo.email.replace(/\s/g, ''),
            password: userInfo.password,
          }),
        );
      })
      .catch((error) => {
        thunkApi.dispatch(setLoading(false));
        thunkApi.dispatch(setError(error.response.data.code));
      });
  },
);
export const sendSubscribe = createAsyncThunk(
  'user/sendSubscribe',
  async (podcast: string, thunkApi) => {
    var user = thunkApi.getState().user;
    var access_token = user.access_token
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }

    axios
      .post(
        'https://yidpod.com/wp-json/yidpod/v1/subscribe',
        JSON.stringify({ subscribe: podcast }),
        {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .then((response) => {

        // thunkApi.dispatch(
        //   upsertPodcast({
        //     id: parseInt(podcast),
        //     subscribed: new Date().getTime(),
        //     image_uri: '',
        //     type: '',
        //     author: '',
        //     title: '',
        //     likes: 0,
        //     updated_at: 0,
        //     feedlink: '',
        //     artistsHeadline: '',
        //     episodesCount: 0,
        //   }),
        // );
      })
      .catch((error) => {
        console.log(error);
        thunkApi.dispatch(addSubscribed(podcast));
      });
  },
);

export const sendComment = createAsyncThunk(
  'user/sendComment',
  async (comment:{podcast:string,message:string}, thunkApi) => {
    var user = thunkApi.getState().user;
    var access_token = user.access_token
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    console.log('sending')
    axios
      .post(
        'https://yidpod.com/wp-json/yidpod/v2/podcast_comments/create',
        JSON.stringify({ podcast: comment.podcast,message:comment.message }),
        {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .then((response) => {
        console.log(response);
        // thunkApi.dispatch(
        //   upsertPodcast({
        //     id: parseInt(podcast),
        //     subscribed: new Date().getTime(),
        //     image_uri: '',
        //     type: '',
        //     author: '',
        //     title: '',
        //     likes: 0,
        //     updated_at: 0,
        //     feedlink: '',
        //     artistsHeadline: '',
        //     episodesCount: 0,
        //   }),
        // );
      })
      .catch((error) => {
        console.log(error);
        // thunkApi.dispatch(addSubscribed(podcast));
      });
  },
);
export const sendUnsubscribe = createAsyncThunk(
  'user/sendUnsubscribe',
  async (podcast: string, thunkApi) => {
    var user = thunkApi.getState().user;
    var access_token = user.access_token
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    axios
      .post(
        'https://yidpod.com/wp-json/yidpod/v1/unsubscribe',
        JSON.stringify({ unsubscribe: podcast }),
        {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .then((response) => {
        // thunkApi.dispatch(updatePodcast({id: podcast, changes:{subscribed: new Date().getTime()}}));
      })
      .catch((error) => {
        // console.log(error);
        thunkApi.dispatch(addUnsubscribed(podcast));
      });
  },
);
export const updateToken = createAsyncThunk(
  'user/refreshToken',
  async (time: string, thunkApi) => {
    const user = await refreshToken(
      thunkApi.getState().user,
      Platform.OS + DeviceInfo.getUniqueId(),
    );
    thunkApi.dispatch(setRefreshToken(user));
  },
);
//   export
export const sendAllPodcasts = createAsyncThunk(
  'user/sendAllPodcasts',
  async (_,thunkApi:any) => {
    var subscribed = thunkApi.getState().offline.subscribed;
    var unsubscribed = thunkApi.getState().offline.unsubscribed;

    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token

    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      // console.log(newuser;
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    // const subscribed = thunkApi.getState().offline.subscribed;
    // const unsubscribed = thunkApi.getState().offline.unsubscribed;
    if (subscribed && access_token) {
      axios
        .post(
          'https://yidpod.com/wp-json/yidpod/v2/subscribed',
          JSON.stringify({ subscribed,unsubscribed }),
          {
            headers: {
              Authorization: 'Bearer ' + access_token,
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
        )
        .then((response) => {
          // thunkApi.dispatch(updatePodcast({id: podcast, changes:{subscribed: new Date().getTime()}}));
          thunkApi.dispatch(clearUnsubscribed(''));
          thunkApi.dispatch(clearSubscribed(''));
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  },
);

export const sendToken = createAsyncThunk(
  'user/sendToken',
  async (token: string, thunkApi) => {
    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token;
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    
    if (access_token) {
      axios
        .post(
          'https://yidpod.com/wp-json/yidpod/v1/notify/addtoken',
          JSON.stringify({ token: token }),
          {
            withCredentials:true,
            
            headers: {
            
              Authorization: 'Bearer ' + access_token,
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
        )
        .then((response) => {
          // if(response)
          thunkApi.dispatch(setNotificationToken(token));
        })
        .catch((error) => {});
    }
  },
);
export const removeToken = createAsyncThunk(
  'user/removeToken',
  async (token: string, thunkApi) => {
    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token;
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    
    if (access_token) {
      axios
        .post(
          'https://yidpod.com/wp-json/yidpod/v1/notify/removetoken',
          JSON.stringify({ token: token }),
          {
            withCredentials:true,
            
            headers: {
            
              Authorization: 'Bearer ' + access_token,
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
        )
        .then((response) => {
          // if(response)
          thunkApi.dispatch(setNotificationToken(""));
        })
        .catch((error) => {});
    }
  },
);
export const addNotifyPodcast = createAsyncThunk(
  'user/addpodcast',
  async (podcast_id: number, thunkApi) => {
    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token;
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      // console.log(newuser;
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    if (access_token) {
      axios
        .post(
          'https://yidpod.com/wp-json/yidpod/v1/notify/addpodcast',
          JSON.stringify({ podcast_id }),
          {
            headers: {
              Authorization: 'Bearer ' + access_token,
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
        )
        .then((response) => {})
        .catch((error) => {});
    }
  },
);
export const removeNotifyPodcast = createAsyncThunk(
  'user/removepodcast',
  async (podcast_id: number, thunkApi) => {
    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token

    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      // console.log(newuser;
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    axios
      .post(
        'https://yidpod.com/wp-json/yidpod/v1/notify/removepodcast',
        JSON.stringify({ podcast_id }),
        {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .then((response) => {})
      .catch((error) => {});
  },
);
export const sendNotify = createAsyncThunk(
  'user/sendNotify',
  async (n:any,thunkApi:any) => {
    var notify = n ? n : thunkApi.getState().offline.notified;
    var user = thunkApi.getState().user;
    // console.log(user.expires_in /1000)
    var access_token = user.access_token;
  
    if (user && user.expires_in < new Date().getTime()) {
      const newuser = await refreshToken(
        user,
        Platform.OS + DeviceInfo.getUniqueId(),
      );
      thunkApi.dispatch(setRefreshToken(newuser));
      access_token = newuser.access_token;
    }
    if (access_token) {
      axios
      .post(
        'https://yidpod.com/wp-json/yidpod/v1/notify/allpodcast',
        JSON.stringify({ notify }), {
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      )
      .then((response) => {})
      .catch((error) => {});


    }
  });

