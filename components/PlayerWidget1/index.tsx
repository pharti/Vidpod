import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { Event, State } from 'react-native-track-player';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  episodeInfoSelector,
  positionSelector,
  selectAllEpisodes,
  updateEpisode,
} from '../../features/episodesSlice';

const events = [
  Event.RemotePlay,
  Event.RemotePause,
  Event.RemotePrevious,
  Event.RemoteNext,
  Event.RemoteStop,
  Event.PlaybackQueueEnded,
  Event.PlaybackTrackChanged,
  Event.RemoteDuck,
];
const PlayerWidget1 = () => {
  const episodes = useSelector(selectAllEpisodes);
  // const tra;
  TrackPlayer.add(episodes);
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
};
export default PlayerWidget1;
