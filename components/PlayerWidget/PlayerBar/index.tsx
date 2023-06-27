import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentSongSelector,
  episodeSelector,
  positionSelector,
} from '../../../features/currentSongSlice';

// import { useTrackPlayerProgress } from 'react-native-track-player';

type PlayerBarProps = {
  styles: {};
  duration: number | null;
  position: number;
};
const areEqual = (prevProps: PlayerBarProps, nextProps: PlayerBarProps) => {
  return prevProps.position === nextProps.position;
};
export const PlayerBar = (props: any) => {
  // const { database, episode } = props;
  // const progress = useTrackPlayerProgress();
  // const dispatch = useDispatch();
  // const position = useSelector(positionSelector);
  // const episode = useSelector(episodeSelector);
  // if (!episode || !episode.id) {
  //   return null;
  // }
  // useEffect(() => {
  //   // const updateposition = async () => {
  //   //   await props.episode.updatePosition(position);
  //   // };
  //   // updateposition();
  // }, []);
  const progress = useProgress();
  // const getProgress = () => {
  // if (props.duration > 0) {
  // return (position / episode.duration) * 100;
  // }
  // return (props.episode.position / progress.duration) * 100;
  // };
  // useEffect(() => {
  //   if (progress.position && progress.position > 0) {
  //     // dispatch(
  //   updateEpisode({
  //     id: props.id,
  //     changes: { position: progress.position },
  //   }),
  // );
  // const updateposition = async () =>
  //   await database.write(async () => {
  //     const oldepisode = await database.get('episodes').find(episode.id);

  //     await oldepisode.update((e) => {
  //       e.position = progress.position;
  //     });
  //   });
  // updateposition();

  // }, [progress.position]);
  return (
    <View>
      <View
        style={[
          {
            height: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            backgroundColor: 'green',
          },
          { width: `${(progress.position / progress.duration) * 100}%` },
        ]}
      />

      <View
        style={[
          {
            height: 2,

            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#3e3e3e',
          },
          { width: `100%` },
        ]}
      />
    </View>
  );
};
