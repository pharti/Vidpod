// import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import {
  setJSExceptionHandler,
  getJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import App from './App';
import TrackPlayer, { Capability } from 'react-native-track-player';
import PlaybackService from './service.js';
// import * as RootNavigation from './RootNavigation';
// import { useDispatch } from 'react-redux';
// import { setNotificationToken } from './features/generalSlice';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
AppRegistry.registerComponent('main', () => App);

// registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);

const exceptionhandler = async (error, isFatal) => {
  // your error handler function
  // console.log(error);
  // return;
  if (error.message) {
    await fetch('https://yidpod.com/wp-json/yidpod/v1/send-errors', {
      method: 'POST',
      body: JSON.stringify({
        error: error.name + '\n' + error.message + '\n' + error.stack,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });
  }
};
setJSExceptionHandler(exceptionhandler, true);
setNativeExceptionHandler(async exceptionString => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  // NOTE: alert or showing any UI change via JS
  // WILL NOT WORK in case of NATIVE ERRORS.
  // return;
  // console.log(exceptionString);
  await fetch('https://yidpod.com/wp-json/yidpod/v1/send-errors', {
    method: 'POST',

    body: JSON.stringify({ error: exceptionString }),
    headers: {
      'Content-type': 'application/json',
    },
  });
});
