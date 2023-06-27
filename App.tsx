// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  createNetworkMiddleware,
  NetworkProvider,
  reducer as network,
  useIsConnected,
} from 'react-native-offline';

import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import currentSongReducer from './features/currentSongSlice';
import episodesReducer from './features/episodesSlice';
import generalReducer from './features/generalSlice';
import offlineReducer from './features/offlineSlice';
import podcastsReducer from './features/podcastsSlice';
import updateReducer from './features/updateSlice';
import userReducer, {
  sendAllPodcasts,
  sendToken,
  userSelector,
} from './features/userSlice';

// import useCachedResources from './hooks/useCachedResources';
import { Q } from '@nozbe/watermelondb';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnyAction,
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import createMigrate from 'redux-persist/es/createMigrate';
import { PersistGate } from 'redux-persist/integration/react';
import { database } from './database';
import useColorScheme from './hooks/useColorScheme';
import { refreshToken } from './js/helpers';
import Navigation from './navigation';
import { LoginScreen } from './screens/LoginScreen';

// Add this on top of App.js
import { Platform } from 'react-native';

import { firebase } from '@react-native-firebase/messaging';
// import BackgroundFetch from 'react-native-background-fetch';
import { mySync } from './database/sync';
import { SetupService } from './setupservice';
import RNUxcam from 'react-native-ux-cam';
RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
const configuration = {
  userAppKey: '6z40au9stpyk8k7',
  /*
      disable advanced gestures if you're having issues with
      swipe gestures and touches during app interaction
  */
  // enableAdvancedGestureRecognition: false
};
RNUxcam.startWithConfiguration(configuration);
// import whyDidYouRender from '@welldone-software/why-did-you-render';
// whyDidYouRender(React, {
//   trackAllPureComponents: true,
//   trackExtraHooks: [[ReactRedux, 'useSelector']],
// });
const AppDetails = () => {
  // const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const database = useDatabase();
  const isConnected = useIsConnected();
  const loggedIn = useRef(user.loggedIn);

  useEffect(() => {
    if (loggedIn.current != user.loggedIn) {
      // if (user.loggedIn) {
      // const updatePodcasts = async () => {
      //   await database.write(async () => {
      //     const podcasts = await database
      //       .get('podcasts')
      //       .query(Q.where('subscribed', Q.gt(0)))
      //       .fetch();
      //     await database.batch(
      //       ...podcasts.map(p =>
      //         p.prepareUpdate(e => {
      //           e.subscribed = 0;
      //         }),
      //       ),
      //     );
      //   });
      // };
      // updatePodcasts();

      // }
      loggedIn.current = user.loggedIn;
    }
  }, [user.loggedIn]);
  useEffect(() => {
    if (isConnected) {
      dispatch(sendAllPodcasts());
    }
  }, []);
  useEffect(() => {
    async function run() {
      const isSetup = await SetupService();
      // setIsPlayerReady(isSetup);

      // const queue = await TrackPlayer.getQueue();
      // if (isSetup && queue.length <= 0) {
      // await QueueInitalTracksService();
      // }
    }

    run();
  }, []);

  useEffect(() => {
    if (user.access_token) {
      firebase
        .messaging()
        .requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          provisional: false,
          sound: true,
        })
        .then(() => {
          firebase
            .messaging()
            .getToken()
            .then(async token => {
              // if (token != user.notification_token) {
              // if (token) {
              //   dispatch(removeToken(user.notification_token));
              // }
              dispatch(sendToken(token));
              // }
              // const n = (
              //   await database
              //     .get('podcasts')
              //     .query(Q.where('notify', Q.eq(true)))
              //     .fetch()
              // ).map(p => p._raw.id);
              // dispatch(sendNotify(n));
            });
        });

      return firebase.messaging().onTokenRefresh(token => {
        if (token != user.notification_token) {
          dispatch(sendToken(token));
        }
      });
    }
  }, [user.access_token]);
  const gettingNewEpisodes = async () => {
    const p = await database
      .get('podcasts')
      .query(Q.where('subscribed', Q.gt(0)))
      .fetch();
    for (let index = 0; index < p.length; index++) {
      const podcast = p[index];
      const lastepisode = await podcast.latestepisode;
      if (lastepisode.length > 0) {
        //fetch all new episodes after this episodes
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          podcast.id +
          '&published_date=' +
          lastepisode[0].publishedDate +
          '&how=>&limit=1000';
        await fetch(url, {
          headers: { 'cache-control': 'public, max-age=0' },
          cache: 'no-cache',
        })
          .then(response => {
            return response.json();
          })
          .then(async response => {
            const episodes = response;
            await podcast.addEpisodes(episodes);
          });
      } else {
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          podcast.id +
          '&published_date=' +
          new Date().getTime() / 60 +
          '&how=<&limit=1';
        await fetch(url, {
          headers: { 'cache-control': 'public, max-age=0' },
          cache: 'no-cache',
        })
          .then(response => {
            return response.json();
          })
          .then(async response => {
            const episodes = response;
            await podcast.addEpisodes(episodes);
          })
          .catch(error => {
            // console.log(error);
            // thunkApi.dispatch(setError(error.response.data.message));
          });
      }
    }
  };

  const initBackgroundFetch = async () => {
    // BackgroundFetch event handler.
    const onEvent = async taskId => {
      // console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...
      // IMPORTANT:  You must signal to the OS that your task is complete.

      if (isConnected) {
        // await gettingNewEpisodes();
        mySync(database, user.wp_user ? user.wp_user.ID : null);
      }
      BackgroundFetch.finish(taskId);
    };

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async taskId => {
      // console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    };

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 30,
        enableHeadless: true,
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      },
      onEvent,
      onTimeout,
    );

    // console.log('[BackgroundFetch] configure status: ', status);
  };

  // if (!isLoadingComplete) {
  //   return null;
  // }
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#181818' }}>
      <>
        {user.loggedIn || user.skip ? (
          <Navigation colorScheme={colorScheme} />
        ) : (
          <LoginScreen />
        )}
        {/* <StatusBar style="light" /> */}
      </>
    </SafeAreaProvider>
  );
};
// };

const migration1 = (state: any) => {
  return new Promise(async (resolve, reject) => {
    const podcasts = state.podcasts;
    const user = state.user;
    // const currentSong = state.currentSong;
    if (user.refresh_token && user.expires_in < new Date().getTime()) {
      state.user = await refreshToken(state.user, null);
    }
    if (
      podcasts.ids.length > 0 &&
      state.user.access_token &&
      state.user.access_token != ''
    ) {
      const subscribed = podcasts.ids.filter(
        p =>
          podcasts.entities[p].subscribed &&
          podcasts.entities[p].subscribed > 0,
      );
      fetch(`https://yidpod.com/wp-json/yidpod/v1/sync?type=podcasts`, {
        method: 'POST',
        body: JSON.stringify(subscribed),
        headers: {
          Authorization: 'Bearer ' + state.user.access_token,
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            state.podcasts = { ids: [], entities: {} };
          }
          resolve({ ...state });
        })
        .catch(error => {
          resolve({ ...state });
        });
    } else {
      resolve({ ...state });
    }
  });
};
const migration2 = (state: any) => {
  return new Promise((resolve, reject) => {
    if (state.user.wp_user) {
      fetch(`https://yidpod.com/wp-json/yidpod/v1/updatetoken`, {
        method: 'POST',
        body: JSON.stringify({
          deviceId: Platform.OS + DeviceInfo.getUniqueId(),
          user_id: state.user.wp_user.ID,
          token: state.user.refresh_token,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(response => {
          resolve(state);
        })
        .catch(error => {
          // console.log(error);
          resolve(state);
        });
    }
  });
};
const migration3 = async (state: any) => {
  if (state.user.wp_user) {
    const newuser = await refreshToken(
      state.user,
      Platform.OS + DeviceInfo.getUniqueId(),
    );
    state.user = newuser;
    return state;
  }
  return state;
};
const migration4 = async (state: any) => {
  state.currentSong.status = 'paused';
  return state;
};

export default () => {
  const migration5 = async (state: any) => {
    await database.write(async () => {
      // sqlite:
      const episodesCollection = database.get('episodes');
      const episodes = await database.get('episodes').query().fetch();
      const playing = await database
        .get('episodes')
        .query(Q.where('state', 'playing'))
        .fetch();
      state.currentSong.episode_id = 'e' + playing.wId;
      const episodesCreate = episodes.map(episode =>
        episodesCollection.prepareCreate(e => {
          e._raw.id = 'e' + episode.wId;
          e.title = episode.title;
          e.imageUri = episode.imageUri;
          e.position = episode.position;
          e.state = episode.state;
          e.podcast.id = episode.podcast.id;
          e.author = episode.author;
          e.duration = episode.duration;
          e.played = episode.played;
          e.content = episode.content;
          e.url = episode.url;
          e.eIndex = episode.eIndex;
          e.playDate = episode.playDate;
          e.wId = episode.wId;
          e.description = episode.description;
          e.cachedUrl = episode.cachedUrl;
          e.likes = episode.likes;
          // e.updated_at = episode.updated_at;
          e.publishedDate = episode.publishedDate;
        }),
      );
      await database.batch(
        ...episodes.map(episode => episode.prepareDestroyPermanently()),
        ...episodesCreate,
      );
    });
    return state;
  };

  const migration6 = async (state: any) => {
    //get notified and subscribed and add them to the offline
    const subscribed = (
      await database
        .get('podcasts')
        .query(Q.where('subscribed', Q.gt(0)))
        .fetch()
    ).map(s => {
      return { subscribed: s.subscribed, id: s._raw.id };
    });
    state.offline.subscribed = subscribed;

    const n = (
      await database
        .get('podcasts')
        .query(Q.where('notify', Q.eq(true)))
        .fetch()
    ).map(p => p._raw.id);

    state.offline.notified = n;
    return state;
  };
  const migrations = {
    0: (state: any) => {
      return {
        ...state,
      };
    },
    1: migration1,
    2: migration2,
    3: migration3,
    4: migration4,
    5: migration5,
    6: migration6,
  };
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['general'],
    migrate: createMigrate(migrations, { debug: true }),
    version: 6,
  };
  const reducers = combineReducers({
    general: generalReducer,
    user: userReducer,
    currentSong: currentSongReducer,
    podcasts: podcastsReducer,
    episodes: episodesReducer,
    offline: offlineReducer,
    update: updateReducer,
    network,
  });

  const rootReducer = (state: any, action: AnyAction) => {
    /* if you are using RTK, you can import your action and use it's type property instead of the literal definition of the action  */
    // if (action.type === logout.type) {
    //   return reducers(undefined, action);
    // }

    return reducers(state, action);
  };
  const networkMiddleware = createNetworkMiddleware();
  const middlewares = [networkMiddleware];
  const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: [
      ...middlewares,
      ...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    ],

    devTools: process.env.NODE_ENV !== 'development' ? false : true,
  });
  // persistStore(store).purge();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        {/* <RealmProvider realm={realm}> */}
        <DatabaseProvider database={database}>
          <NetworkProvider pingServerUrl={'https://yidpod.com'}>
            <AppDetails />
            {/* </RealmProvider> */}
          </NetworkProvider>
        </DatabaseProvider>
      </PersistGate>
    </Provider>
  );
};
