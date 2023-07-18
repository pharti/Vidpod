import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  positionSelector,
  setSliding,
  setValuePosition
} from '../../../features/currentSongSlice';
import { Text, View } from '../../Themed';
import { LeftValue } from '../LeftValue';

export const PlayerSlider = (props: any) => {

  const dispatch = useDispatch();
  const position = useSelector(positionSelector);

  const [duration, setDuration] = useState(0);

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
          backgroundColor: '#242424',
        }}
      >
        <LeftValue />
        <Text style={{ color: 'white', opacity: 0.7, fontSize: 12 }}>
          {props.durationText}
        </Text>
      </View>
    </View>
  );
};
