import React, { useState } from 'react';
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
import { convertMstoDuration } from '../../js/time';
import styles from './styles';

import { useDatabase } from '@nozbe/watermelondb/hooks';
import { addTrack } from '../../js/trackFunctions';
import { DownloadButton } from '../DownloadButton';
import PlayButton from './PlayButton';
import ProgressBar from './ProgressBar';
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

export const SongListItem = props => {
  const { podcast, item: songInfo } = props;
  const dispatch = useDispatch();
  const database = useDatabase();
  const duration =
    songInfo.duration.indexOf(':') > -1
      ? songInfo.duration
      : convertMstoDuration(songInfo.duration);
  const [error, setError] = useState(null);
  const currentSong = useSelector(currentSongSelector);
  const episodeLength = duration ? duration.replace(/^0+:?0?/gi, '') : 0;
  const navigation = useNavigation();
  const published = moment
    .unix(
      songInfo.published_date
        ? songInfo.published_date
        : songInfo.publishedDate,
    )
    .fromNow();
  // const published = moment(new Date(song.published_date)).format('MMM DD');
  const episode = useSelector(state => {
    const episodes = state.episodes.entities;
    const episode = Object.entries(episodes).filter(
      ([key, value]) => value.url == songInfo.url,
    );
    return episode;
  });
  const isConnected = true;
  // useEffect(() => {
  //   if (episode.length > 0) {
  //     const updateEpisode = async () => {
  //       if (episode.length > 0) {
  //         // await song.updatePosition(episode[0][1].position);
  //         // dispatch(removeEpisode(episode[0][0]));
  //       }
  //     };
  //     updateEpisode(episode);
  //   }
  // }, [episode]);
  const onPressSong = async () => {
    if (!isConnected && song.cachedUrl && song.cachedUrl != '') {
      return;
    }

    const trackIndex = await TrackPlayer.getCurrentTrack();
    if (trackIndex == null) {
      dispatch(
        setCurrentSong({
          episode_id: songInfo.id,
          podcast_id: songInfo.podcast_id + '',
        }),
      );
      dispatch(setPosition(song.position));

      await addTrack(songInfo, podcast.title, song.position);
      await TrackPlayer.play();
    } else {
      const track = await TrackPlayer.getTrack(trackIndex);
      if (
        !track ||
        (track && track.id.replace('e', '') != song.id.replace('e', ''))
      ) {
        dispatch(
          setCurrentSong({
            episode_id: songInfo.id,
            podcast_id: songInfo.podcast_id + '',
          }),
        );
        dispatch(setPosition(song.position));
        await addTrack(songInfo, podcast.title, song.position);
        await TrackPlayer.play();
        dispatch(setStatus('playing'));
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
      id: songInfo.id,
      name: songInfo.title,
      episode: songInfo,
      podcast: podcast,
    });
    dispatch(setShow(true));
  };

  return (
    <TouchableOpacity onPress={onPressNavigate}>
      <View style={styles.flexContainer}>
        <View style={[styles.container]}>
          <FastImage
            source={{
              uri:
                !error && songInfo.image_uri
                  ? songInfo.image_uri
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
              {songInfo.title}
            </Text>
            <View style={styles.info}>
              {!podcast.type || podcast.type.indexOf('audiobook') == -1 ? (
                <Text style={styles.episodeLength}>
                  <FontAwesome name="calendar" /> {published}
                </Text>
              ) : null}
              {songInfo.duration ? (
                <Text style={styles.episodeLength}>
                  <FontAwesome name="clock-o" /> {episodeLength}
                </Text>
              ) : null}
              <DownloadButton
                episode_url={songInfo.url}
                id={songInfo.id ? 'e' + songInfo.id.replace('e', '') : ''}
                width={20}
                height={20}
                podcast={podcast}
                episode={songInfo}
                containerStyle={{
                  justifyContent: 'center',
                  marginLeft: 10,
                  zIndex: 10,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.playArrows}>
              <PlayButton
                status={
                  currentSong.episode_id == songInfo.id
                    ? currentSong.status
                    : 'paused'
                }
                podcast={podcast}
                episode={songInfo}
                forfeed={false}
                // onPlay={onPressSong}
                isConnected={isConnected}
              />
            </View>
          </View>
        </View>
        <ProgressBar
          id={songInfo.id}
          status={
            currentSong.episode_id == songInfo.id
              ? currentSong.status
              : 'paused'
          }
          progressBar={styles.progressBar}
          duration={songInfo.duration}
        />
      </View>
    </TouchableOpacity>
  );
};
