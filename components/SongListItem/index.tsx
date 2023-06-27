import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import TrackPlayer from 'react-native-track-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  currentSongSelector,
  setCurrentSong,
  setPosition,
  setShow,
  setStatus,
} from '../../features/currentSongSlice';
import { convertDurationtoMs, convertMstoDuration } from '../../js/time';
import styles from './styles';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { addTrack } from '../../js/trackFunctions';
import { DownloadButton } from '../DownloadButton';
import { PlayButton } from './PlayButton';

export type SongListItemProps = {
  item: any;
  index: number;
  isOpaque: boolean;
  // state: Episode['state'];
  song: any;
  podcast_title: string;
  playSong: any;
  podcast_image: string;
};
// const equalProps = (
//   prevProps: SongListItemProps,
//   nextProps: SongListItemProps,
// ) => {
//   return (
//     prevProps.item.position === nextProps.item.position &&
//     prevProps.item.state == nextProps.item.state
//   );
// };

const SongListItem = props => {
  const { song, podcast } = props;
  const dispatch = useDispatch();
  const duration =
    song.duration.indexOf(':') > -1
      ? song.duration
      : convertMstoDuration(song.duration);
  const [error, setError] = useState(null);
  const currentSong = useSelector(currentSongSelector);
  const episodeLength = duration.replace(/^0+:?0?/gi, '');
  const navigation = useNavigation();
  const published = moment.unix(song.publishedDate).fromNow();
  // const oldWay = moment(new Date(song.published_date)).format('MMM DD')
  const episode = useSelector(state => {
    const episodes = state.episodes.entities;
    const episode = Object.entries(episodes).filter(
      ([key, value]) => value.url == song.url,
    );
    return episode;
  });
  const isConnected = true;
  useEffect(() => {
    if (episode.length > 0) {
      const updateEpisode = async () => {
        if (episode.length > 0) {
          // await song.updatePosition(episode[0][1].position);
          // dispatch(removeEpisode(episode[0][0]));
        }
      };
      updateEpisode();
    }
  }, [episode]);
  const onPressSong = async () => {
    if (!isConnected && song.cachedUrl && song.cachedUrl != '') {
      return;
    }
    const trackIndex = await TrackPlayer.getCurrentTrack();
    if (trackIndex == null) {
      dispatch(setCurrentSong(song.id));
      dispatch(setPosition(song.position));

      await addTrack(song, song.podcast.title, song.position);
      await TrackPlayer.play();
    } else {
      const track = await TrackPlayer.getTrack(trackIndex);

      if (track.id != song.id) {
        dispatch(setCurrentSong(song.id));
        dispatch(setPosition(song.position));

        await addTrack(song, song.podcast.title, song.position);
        await TrackPlayer.play();
      } else {
        if (currentSong.status == 'playing') {
          await TrackPlayer.pause();
          dispatch(setStatus('paused'));

          // await song.updateState('paused');
        } else {
          await TrackPlayer.play();
          dispatch(setStatus('playing'));

          // await song.updateState('playing');
        }
      }
    }
    dispatch(setShow(true));
  };
  const onPressNavigate = () => {
    navigation.navigate('EpisodeScreen', {
      id: song.id,
      name: song.title,
      podcast_id: song.podcast.id,
    });
    dispatch(setShow(true));
  };

  const getProgress = (duration: string) => {
    const p =
      currentSong.status == 'playing' && currentSong.episode_id == song.id
        ? currentSong.position
        : song.position;

    if (p > 0) {
      const newduration =
        duration.indexOf(':') > -1 ? convertDurationtoMs(duration) : duration;
      return Math.round((p / newduration) * 100);
    } else {
      return 1;
    }
  };
  const currentProgress = getProgress(song.duration);
  // const opaque = currentProgress > 99 ? 0.5 : 1;
  const showGreen = currentProgress > 1 ? 'flex' : 'none';
  return (
    <TouchableOpacity onPress={onPressNavigate}>
      <View style={styles.flexContainer}>
        <View style={[styles.container]}>
          {song.imageUri || props.podcast.imageUri ? (
            <Image
              source={{
                uri:
                  !error && song.imageUri
                    ? song.imageUri
                    : props.podcast.imageUri,
              }}
              style={styles.image}
              onError={e => {
                setError(e.nativeEvent.error);
              }}
            />
          ) : (
            <View style={styles.noimage}></View>
          )}

          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {song.title}
            </Text>
            <View style={styles.info}>
              {podcast.type.indexOf('audiobook') == -1 ? (
                <Text style={styles.episodeLength}>
                  <FontAwesome name="calendar" /> {published}
                </Text>
              ) : null}
              {song.duration ? (
                <Text style={styles.episodeLength}>
                  <FontAwesome name="clock-o" /> {episodeLength}
                </Text>
              ) : null}
              <DownloadButton
                episode_url={song.url}
                id={song.id}
                width={20}
                height={20}
                containerStyle={{
                  justifyContent: 'center',
                  marginLeft: 10,
                  zIndex: 10,
                }}
                cachedUrl={song.cachedUrl}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.playArrows}>
              <PlayButton
                status={
                  currentSong.episode_id == song.id
                    ? currentSong.status
                    : 'paused'
                }
                cachedUrl={song.cachedUrl}
                onPlay={onPressSong}
                isConnected={isConnected}
              />
            </View>
          </View>
        </View>
        {/* */}

        <View
          style={{
            // justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <View
            style={[
              styles.progressBar,

              { display: showGreen },
              { width: `${currentProgress}%` },
            ]}
          />
          <View
            style={[
              {
                height: 2,
                // alignSelf: 'flex-end',
                backgroundColor: '#3e3e3e',
              },
              { width: `${100 - currentProgress}%` },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const enhance = withObservables(['item'], ({ item, database }) => ({
  song: database.get('episodes').findAndObserve(item.id),
  podcast: database.get('podcasts').findAndObserve(item.podcast.id),
}));
export default withDatabase(enhance(SongListItem));
