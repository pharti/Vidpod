import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  currentSongSelector,
  setCurrentSong,
  setShow,
} from '../../features/currentSongSlice';
import { convertDurationtoMs, convertMstoDuration } from '../../js/time';
import styles from './styles';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import { catchError } from 'rxjs/operators';
import { onPlayPausePress } from '../../database/functions';
import { DownloadButton } from '../DownloadButton';
import PlayButton from './PlayButton';
import FastImage from 'react-native-fast-image';

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
  const { podcast, item: song, episode } = props;
  const dispatch = useDispatch();
  const database = useDatabase();
  const duration =
    song.duration.indexOf(':') > -1
      ? song.duration
      : convertMstoDuration(song.duration);
  const [error, setError] = useState(null);
  const currentSong = useSelector(currentSongSelector);
  const episodeLength = duration.replace(/^0+:?0?/gi, '');
  const navigation = useNavigation();

  const published = moment.unix(song.published_date).fromNow();
  // const published = moment(new Date(song.published_date)).format('MMM DD');
  //   const episode = useSelector(state => {
  //     const episodes = state.episodes.entities;
  //     const episode = Object.entries(episodes).filter(
  //       ([key, value]) => value.url == song.url,
  //     );
  //     return episode;
  //   });
  const isConnected = true;
  //   useEffect(() => {
  //     if (episode.length > 0) {
  //       const updateEpisode = async () => {
  //         if (episode.length > 0) {
  //           // await song.updatePosition(episode[0][1].position);
  //           // dispatch(removeEpisode(episode[0][0]));
  //         }
  //       };
  //       updateEpisode();
  //     }
  //   }, [episode]);
  const onPressSong = async () => {
    if (!isConnected && song.cachedUrl && song.cachedUrl != '') {
      return;
    }
    dispatch(setCurrentSong({ episode_id: song.id, podcast_id: podcast.id }));
    onPlayPausePress(currentSong.status, song.id, dispatch);
    // const trackIndex = await TrackPlayer.getCurrentTrack();
    // if (trackIndex == null) {
    //   dispatch(
    //     setCurrentSong({
    //       episode_id: song.id,
    //       podcast_id: song.podcast_id,
    //     }),
    //   );
    //   dispatch(setPosition(song.position));

    //   await addTrack(song, podcast.title, song.position);
    //   await TrackPlayer.play();
    // } else {
    //   const track = await TrackPlayer.getTrack(trackIndex);
    //   if (
    //     !track ||
    //     (track && track.id.replace('e', '') != song.id.replace('e', ''))
    //   ) {
    //     dispatch(
    //       setCurrentSong({
    //         episode_id: song.id,
    //         podcast_id: song.podcast_id,
    //       }),
    //     );
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
  const onPressNavigate = () => {
    //THIS NEEDS TO BE FIXED. If there is no song info
    navigation.navigate('EpisodeScreen', {
      id: song.id,
      name: song.title,
      podcast_id: podcast.id,
    });
    dispatch(setShow(true));
  };

  const getProgress = (duration: string) => {
    const p =
      currentSong.status == 'playing' && currentSong.episode_id == song.id
        ? currentSong.position
        : episode.position;

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
  if (!podcast || !song) {
    return null;
  }
  return (
    <TouchableOpacity onPress={onPressNavigate}>
      <View style={styles.flexContainer}>
        <View style={[styles.container]}>
          <FastImage
            source={{
              uri:
                !error && song.image_uri
                  ? song.image_uri
                  : 'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
                    podcast.id,
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
            onError={e => {
              setError(e.nativeEvent.error);
            }}
          />

          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {song.title}
            </Text>
            <View style={styles.info}>
              {!podcast.type || podcast.type.indexOf('audiobook') == -1 ? (
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
                podcast={podcast}
                episode={song}
                id={'e' + song.id.replace('e', '')}
                width={20}
                height={20}
                containerStyle={{
                  justifyContent: 'center',
                  marginLeft: 10,
                  zIndex: 10,
                }}
                cachedUrl={episode.cachedUrl}
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
                podcast={podcast}
                episode={song}
                id={song.id}
                forfeed={false}
                cachedUrl={episode.cachedUrl}
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
const enhance = withObservables(['item'], ({ item, database, route }) => ({
  podcast: database
    .get('podcasts')
    .findAndObserve(
      item.podcast_id ? item.podcast_id + '' : item._raw.podcast_id,
    )
    .pipe(
      catchError(async err => {
        fetch(
          'https://yidpod.com/wp-json/yidpod/v2/podcasts?id=' +
            (item.podcast_id ? item.podcast_id + '' : item._raw.podcast_id),
        )
          .then(res => res.json())
          .then(async p => {
            const album = await database.write(async () => {
              return await database.get('podcasts').create(podcast => {
                podcast.author = p.author;
                podcast.imageUri = p.image_uri;
                podcast.description = p.description;
                podcast.title = p.title.rendered ? p.title.rendered : p.title;
                podcast._raw.id = p.id + '';
                podcast.type = p.tags;
                podcast.likes = p.likes;
              });
            });

            return album;
          });
      }),
    ),
  episode: database
    .get('episodes')
    .findAndObserve('e' + item.id)
    .pipe(
      catchError(async err => {
        return { position: 0 };
      }),
    ),
}));
export default withDatabase(enhance(SongListItem));
