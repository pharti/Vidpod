import TrackPlayer, { Capability, Event } from 'react-native-track-player';
module.exports = async () => {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
  // TrackPlayer.addEventListener(Event.RemoteNext, () => {
  //   // console.log('Event.RemoteNext');
  //   // TrackPlayer.skipToNext();
  // });

  // TrackPlayer.addEventListener(Event.RemotePrevious, () => {
  //   // console.log('Event.RemotePrevious');
  //   // TrackPlayer.skipToPrevious();
  // });
};
