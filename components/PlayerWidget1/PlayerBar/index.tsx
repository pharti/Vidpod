import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { positionSelector } from '../../../features/episodesSlice';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { LeftValue } from '../../PlayerHeader/LeftValue';
import Slider from '@react-native-community/slider';

type PlayerBarProps = {
  full: boolean;
  maxValue: number;
  durationText: string;
  currentSong: { episode_id: string };
};
// const areEqual = (prevProps: PlayerBarProps, nextProps: PlayerBarProps) => {
//   return prevProps.position === nextProps.position;
// };
export const PlayerBar = (props: PlayerBarProps) => {
  const progress = useProgress();

  const position = useSelector((state) =>
    positionSelector(state, props.currentSong.episode_id),
  );
  const getProgress = () => {
    if (progress.duration === 0) {
      return 0;
    }
    return (progress.position / progress.duration) * 100;
  };

  return !props.full ? (
    <View
      style={[
        {
          marginTop: -9,
          height: 3,
          backgroundColor: 'green',
        },
        { width: `${getProgress()}%` },
      ]}
    />
  ) : (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#1C1E22',
        justifyContent: 'center',
      }}
    >
      <LeftValue position={position} />
      <Slider
        style={{ width: 250, height: 20 }}
        minimumValue={0}
        onSlidingComplete={(value: number) => {
          // seekto(value);
        }}
        value={position}
        maximumValue={props.maxValue}
        minimumTrackTintColor={'white'}
        maximumTrackTintColor={'white'}
        onValueChange={(value: number) => {
          // seekto(value);
        }}
      />
      <View>
        <Text style={{ color: 'white' }}>{props.durationText}</Text>
      </View>
    </View>
  );
};
