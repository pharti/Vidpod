import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useDispatch } from 'react-redux';
import { catchError } from 'rxjs/operators';
import {
  createEpisode,
  onPlayPausePress,
  updateEpisode,
} from '../../../database/functions';
import { setCurrentSong, setShow } from '../../../features/currentSongSlice';
import { styles } from './styles';

const PlayButton = props => {
  const { status, isConnected, episode, podcast, song, forfeed } = props;

  const dispatch = useDispatch();
  const onPressSong = async () => {
    if (!isConnected && song.cachedUrl && song.cachedUrl != '') {
      return;
    }
    // return;
    if (!forfeed) {
      if (!song.id) {
        await createEpisode(episode, null);
      } else {
        await updateEpisode(episode, null);
      }
    }
    dispatch(
      setCurrentSong({ episode_id: episode.id, podcast_id: podcast.id + '' }),
    );
    onPlayPausePress(status, episode.id, dispatch);
    // if (song && !song.id) {
    //   await database.write(async () => {
    //     const newsong = await database.get('episodes').create(e => {
    //       e._raw.id = 'e' + songInfo.id;
    //     });
    //   });
    // }
    // const trackIndex = await TrackPlayer.getCurrentTrack();
    // if (trackIndex == null) {
    //   dispatch(setCurrentSong(id));
    //   // dispatch(setPosition(song.position));

    //   await addTrack(songInfo, podcast.title, song.position);
    //   await TrackPlayer.play();
    // } else {
    //   const track = await TrackPlayer.getTrack(trackIndex);
    //   if (track.id != song.id) {
    //     dispatch(setCurrentSong(songInfo.id));
    //     dispatch(setPosition(song.position));
    //     await addTrack(song, podcast.title, song.position);
    //     await TrackPlayer.play();
    //     dispatch(setStatus('playing'));
    //   } else {
    //     if (currentSong.status == 'playing') {
    //       await TrackPlayer.pause();
    //       dispatch(setStatus('paused'));
    //       // await song.updateState('paused');
    //     } else {
    //       await TrackPlayer.play();
    //       dispatch(setStatus('playing'));
    //       // await song.updateState('playing');
    //     }
    //   }
    // }

    dispatch(setShow(true));
  };
  return (
    <TouchableOpacity onPress={() => onPressSong()}>
      <View style={styles.playContainer}>
        {status == 'buffering' ? (
          <ActivityIndicator size={24} color={'#1C1E22'} />
        ) : (
          <FontAwesome5
            name={status == 'playing' ? 'pause' : 'play'}
            size={20}
            color={
              isConnected || (!isConnected && song.cachedUrl)
                ? '#1C1E22'
                : 'grey'
            }
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const enhance = withObservables(
  ['episode', 'status'],
  ({ episode, database }) => ({
    song: database
      .get('episodes')
      .findAndObserve('e' + episode.id.replace('e', ''))
      .pipe(
        catchError(async err => {
          return { position: 0, id: 0 };
        }),
      ),
  }),
);
export default withDatabase(enhance(PlayButton));
