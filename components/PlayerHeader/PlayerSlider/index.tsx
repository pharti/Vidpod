import React, { useEffect, useRef, useState } from 'react';
import Slider, { SliderRef } from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';

import { View, Text } from '../../Themed';
import { LeftValue } from '../LeftValue';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentSongSelector,
  episodeIdSelector,
  setPosition,
  setValuePosition,
  positionSelector,
  setSliding,
} from '../../../features/currentSongSlice';
// import { positionSelector } from '../../../features/episodesSlice';

export const PlayerSlider = (props: any) => {
  // const progress = useProgress(500);

  // const { position: episodePosition, state } = props.episode;
  // const [newposition, setNewPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const dispatch = useDispatch();
  // const database = useDatabase();
  const position = useSelector(positionSelector);
  // const dispatch = useDispatch();
  const seekto = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  return (
    <View style={{ flexDirection: 'column' }}>
      <Slider
        style={props.sliderStyle}
        minimumValue={0}
        onSlidingComplete={(value: number) => {
          dispatch(setSliding(false));
          seekto(value);
          // if (prevstate.current == 'playing') {
          //   await TrackPlayer.play();
          // }
          // await props.episode.updateState(prevstate.current);
        }}
        onSlidingStart={() => {
          dispatch(setSliding(true));
        }}
        step={1}
        value={position}
        thumbTintColor={'#dddddd'}
        maximumValue={props.maxValue ? props.maxValue : duration}
        minimumTrackTintColor={'white'}
        maximumTrackTintColor={'white'}
        onValueChange={(value: number) => {
          dispatch(setValuePosition(value));
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 15,
          marginLeft: 15,
        }}
      >
        <LeftValue />
        <Text style={{ color: 'white', opacity: 0.7, fontSize: 12 }}>
          {props.durationtext}
        </Text>
      </View>
    </View>
  );
};
