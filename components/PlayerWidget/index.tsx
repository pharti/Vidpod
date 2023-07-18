import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  currentSongSelector,
  episodeIdSelector,
  setCurrentSong,
  setPosition,
  setShow,
  setStatus,
} from '../../features/currentSongSlice';
import styles from './styles';

import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import BackgroundTimer from 'react-native-background-timer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextTicker from 'react-native-text-ticker';
import { of as of$ } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { convertDurationtoMs } from '../../js/time';
import { addTrack } from '../../js/trackFunctions';
import PlayerScreen from '../../screens/PlayerScreen';
import { PlayerBar } from './PlayerBar';
import PlayerPlayButton from './PlayerPlayButton';

const events = [
  Event.RemotePlay,
  Event.RemotePause,
  Event.RemotePrevious,
  Event.RemoteNext,
  Event.RemoteStop,
  Event.PlaybackQueueEnded,
  Event.PlaybackTrackChanged,
  Event.RemoteDuck,
  Event.PlaybackState,
  Event.PlaybackError,
];

const PlayerWidgetChild = ({ database, episode, podcast }) => {
  if (!episode || !episode.podcast || !podcast) {
    return null;
  }
  const wasplaying = useRef(false);
  const background = useRef(0);
  const [error, setError] = useState(null);
  const currentSong = useSelector(currentSongSelector);

  useTrackPlayerEvents(events, async event => {
    if (event.type == Event.PlaybackState) {
      if (event.state == State.Paused) {
        BackgroundTimer.clearInterval(background.current);
        background.current = 0;
        const position = await TrackPlayer.getPosition();
        dispatch(setStatus('paused'));
        await episode.updatePosition(position);
      }
      if (event.state == State.Playing) {
        if (Platform.OS == 'ios') {
          await TrackPlayer.seekTo(episode.position);
        }
        background.current = BackgroundTimer.setInterval(async () => {
          const state = await TrackPlayer.getState();
          if (state == State.Playing) {
            const position = await TrackPlayer.getPosition();
            dispatch(setPosition(position));
          }
        }, 1000);
        dispatch(setStatus('playing'));
        await episode.playing();
      }
      if (event.state == State.Ready) {
        if (currentSong.status == 'buffering') {
          await TrackPlayer.play();
          dispatch(setStatus('playing'));

          // await episode.updateState('playing');
        }
      }
    }
    if (event.state == State.Buffering) {
      dispatch(setStatus('buffering'));

      // await episode.updateState('buffering');
    }
    if (event.type == Event.PlaybackError) {
      ToastAndroid.show('Error loading file', ToastAndroid.LONG);
    }
    if (event.type == Event.RemotePlay) {
      dispatch(setStatus('playing'));

      // await episode.updateState('playing');
      await TrackPlayer.play();
      // dispatch(
      //   updateEpisode({
      //     id: currentSong.episode_id,
      //     changes: { state: 'playing' },
      //   }),
      // );
    }
    if (event.type == Event.RemotePause) {
      // dispatch(
      //   updateEpisode({
      //     id: currentSong.episode_id,
      //     changes: { state: 'paused' },
      //   }),
      // );
      const position = await TrackPlayer.getPosition();
      dispatch(setStatus('paused'));
      await episode.updatePosition(position);

      await TrackPlayer.pause();
    }
    if (event.type == Event.RemoteStop) {
      const position = await TrackPlayer.getPosition();
      dispatch(setStatus('paused'));
      await episode.updatePosition(position);
      // );

      await TrackPlayer.reset();
    }
    if (event.type == Event.RemotePrevious) {
      const prevEpisode = await database
        .get('episodes')
        .query(
          Q.where('podcast_id', episode.podcast.id),
          Q.where('e_index', episode.eIndex - 1),
        );
      const podcast = await database.get('podcasts').find(episode.podcast.id);
      if (prevEpisode.length > 0) {
        await addTrack(prevEpisode[0], podcast.title, prevEpisode[0].position);
        dispatch(setCurrentSong(prevEpisode[0].id));
        dispatch(setPosition(prevEpisode[0].position));
      } else {
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          episode.podcast.id +
          '&published_date=' +
          episode.publishedDate +
          '&how=<&limit=1&previous=';
        fetch(url)
          .then(p => p.json())
          .then(async e => {
            await podcast.addEpisodes(e);
            const pe = await database
              .get('episodes')
              .query(
                Q.where('podcast_id', episode.podcast.id),
                Q.where('e_index', episode.eIndex - 1),
              );
            await addTrack(pe[0], podcast.title, 0);
            dispatch(setCurrentSong(pe[0].id));
            dispatch(setPosition(pe[0].position));
          });
      }
    }
    if (event.type == Event.PlaybackQueueEnded) {
      // if (episode.podcast && nextEpisodeInfo.e_index && event.track) {
      // dispatch(
      //   updateEpisode({
      //     id: episode.id,
      //     changes: { position: 0 },
      //   }),
      // );
      //check if it got errored out somehow
      // TrackPlayer.usePlaybackStateIs()
      BackgroundTimer.clearInterval(background.current);
      background.current = 0;
      dispatch(setStatus('paused'));
      // await episode.paused();
      if (event.track != undefined || event.track != null) {
        const nextEpisode = await database
          .get('episodes')
          .query(
            Q.where('podcast_id', episode.podcast.id),
            Q.where('e_index', episode.eIndex + 1),
          );
        const podcast = await database.get('podcasts').find(episode.podcast.id);
        if (nextEpisode.length > 0) {
          await addTrack(
            nextEpisode[0],
            podcast.title,
            nextEpisode[0].position,
          );
          dispatch(setCurrentSong(nextEpisode[0].id));
          dispatch(setPosition(nextEpisode[0].position));
          // dispatch(setStatus("playing"));

          // await nextEpisode[0].updateState('playing');
        } else {
          const url =
            'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
            episode.podcast.id +
            '&published_date=' +
            episode.publishedDate +
            '&how=>&limit=1&next=';
          fetch(url)
            .then(p => p.json())
            .then(async e => {
              if (e && e.length) {
                await podcast.addEpisodes(e);
                const ne = await database
                  .get('episodes')
                  .query(
                    Q.where('podcast_id', episode.podcast.id),
                    Q.where('e_index', episode.eIndex + 1),
                  );
                if (ne && ne.length) {
                  await addTrack(ne[0], podcast.title, 0);
                  // await ne[0].updateState('playing');

                  dispatch(setCurrentSong(ne[0].id));
                  dispatch(setPosition(ne[0].position));
                }
              }
            });
        }
      }
    }
    // }

    if (event.type == Event.PlaybackTrackChanged) {
      if (event.track != null && event.nextTrack != event.track) {
        // dispatch(
        //   updateEpisode({
        //     id: event.track,
        //     changes: { state: 'paused' },
        //   }),
        // );
        //Check for index
        const prevTrack = await TrackPlayer.getTrack(event.track);
        const oldepisode = await database.get('episodes').find(prevTrack.id);
        // dispatch(setStatus("paused"));

        await oldepisode.updatePosition(event.position);
        // await TrackPlayer.remove(event.track);
        // await database.write(async () => {
        //   // ToastAndroid.show(episode.title, ToastAndroid.SHORT);
        //   Alert.alert(episode.title, 'Updating position');
        //   if (oldepisode) {
        //     await oldepisode.update((e) => {
        //       e.state = 'paused';
        //       e.position = event.position;
        //     });
        //   }
        // });
      }
    }
    if (event.type == Event.RemoteNext) {
      const nextEpisode = await database
        .get('episodes')
        .query(
          Q.where('podcast_id', episode.podcast.id),
          Q.where('e_index', episode.eIndex + 1),
        );
      const podcast = await database.get('podcasts').find(episode.podcast.id);

      if (nextEpisode.length > 0) {
        await addTrack(nextEpisode[0], podcast.title, nextEpisode[0].position);
        dispatch(setCurrentSong(nextEpisode[0].id));
        dispatch(setPosition(nextEpisode[0].position));
      } else {
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          episode.podcast.id +
          '&published_date=' +
          episode.publishedDate +
          '&how=>&limit=1&next=';
        fetch(url)
          .then(p => p.json())
          .then(async e => {
            await podcast.addEpisodes(e);
            const ne = await database
              .get('episodes')
              .query(
                Q.where('podcast_id', episode.podcast.id),
                Q.where('e_index', episode.eIndex + 1),
              );
            await addTrack(ne[0], podcast.title, 0);

            dispatch(setCurrentSong(ne[0].id));
            dispatch(setPosition(ne[0].position));
          });
      }
    }
    if (event.type == Event.RemoteDuck) {
      if (event.permanent) {
        TrackPlayer.pause().then(() => {
          TrackPlayer.getPosition().then(async (value: number) => {
            const oldepisode = await database
              .get('episodes')
              .find(currentSong.episode_id);

            await oldepisode.updatePosition(value);
          });
        });
      } else {
        if (event.paused) {
          wasplaying.current = currentSong.status == 'playing';

          TrackPlayer.pause().then(() => {
            TrackPlayer.getPosition().then(async (value: number) => {
              // const oldepisode = await database
              //   .get('episodes')
              //   .find(currentSong.episode_id);
              // await oldepisode.paused(value);
            });
          });
        } else {
          if (wasplaying.current) {
            // dispatch(
            //   updateEpisode({
            //     id: currentSong.episode_id,
            //     changes: { playDate: new Date().getTime(), state: 'playing' },
            //   }),
            // );
            // dispatch(setStatus("playing"));

            // await episode.updateState('playing');
            await TrackPlayer.play();
          }
        }
      }
    }
  });
  const changePlaySpeed = async () => {
    await TrackPlayer.setRate(currentSong.playSpeed);
  };
  useEffect(() => {
    changePlaySpeed();
  }, [currentSong.playSpeed]);

  const dispatch = useDispatch();
  /*
    If app gets swiped then it will set state is not paused to false
  */
  useEffect(() => {
    dispatch(setShow(true));
    // realm.write(() => {
    //   const newsong = realm.objectForPrimaryKey(
    //     'Episode',
    //     currentSong.episode_id,
    //   );

    //   newsong.state = 'paused';
    // });
    // dispatch(
    //   updateEpisode({
    //     id: episode.id,
    //     changes: { state: 'paused' },
    //   }),
    // );
    const updatestate = async () => {
      if (episode) {
        dispatch(setStatus('paused'));

        // await episode.updateState('paused');
      }
    };
    updatestate();
    return () => { };
  }, [dispatch]);

  const onPress = () => {
    // TrackPlayer.getPosition().then((value: number) => {
    // dispatch(
    //   updateEpisode({
    //     id: episode.id,
    //     changes: { position: value },
    //   }),
    // );
    // navigation.navigate('PlayerScreen', {
    //   id: episode.id,
    //   title: episode.title,
    //   position: position,
    // });
    dispatch(setShow(false));
    // });
  };
  const addCurrentTrack = useCallback(async () => {
    const podcast = await database.get('podcasts').find(episode.podcast.id);
    await addTrack(episode, podcast.title, episode.position);
  }, [episode]);
  const marginBottom = useSafeAreaInsets().bottom;
  useEffect(() => {
    setError(null);
  }, [episode.id]);

  if (
    currentSong.episode_id != '' &&
    // position !== undefined &&
    episode &&
    episode.podcast &&
    currentSong.show
  ) {
    return (
      <View
        style={[
          styles.container,
          {
            bottom: Platform.OS == 'ios' ? 0 : styles.container.bottom,
          },
        ]}>
        <PlayerBar
          // position={episode.position}
          // id={episode.id}
          database={database}
          episode={episode}
          duration={
            episode.duration.indexOf(':') > -1
              ? convertDurationtoMs(episode.duration)
              : episode.duration
          }
        />
        <View style={styles.innerContainer}>
          <View>
            <TouchableOpacity onPress={onPress}>
              {episode.imageUri || podcast[0].imageUri ? (
                <Image
                  source={{
                    uri:
                      !error && episode.imageUri
                        ? episode.imageUri
                        : podcast[0].imageUri,
                  }}
                  style={styles.image}
                  onError={e => {
                    setError(e.nativeEvent.error);
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.image, { backgroundColor: 'grey' }]} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={onPress}>
              <TextTicker
                style={styles.title}
                scroll={false}
                loop
                duration={10000}>
                {/* <Text numberOfLines={1} style={styles.title}> */}
                {episode.title}
                {/* </Text> */}
              </TextTicker>
              <Text
                style={{
                  color: 'white',
                  opacity: 0.5,
                  fontWeight: '600',
                  paddingTop: 3,
                  fontSize: 14,
                  textAlign: 'left',
                }}
                numberOfLines={1}>
                {podcast ? podcast[0].title : ''}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'relative',
              width: 60,
              height: 60,
            }}>
            <View style={styles.playArrows}>
              <PlayerPlayButton
                addCurrentTrack={addCurrentTrack}
                episode={episode}
              />
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    if (
      !currentSong.show &&
      currentSong.episode_id != '' &&
      episode &&
      episode.podcast
    ) {
      return (
        <PlayerScreen
          episode={episode}
          podcast={podcast[0]}
          // position={position}
          bottom={
            Platform.OS == 'ios' ? marginBottom - 5 : styles.container.bottom
          }
        />
      );
    }
    return null;
  }
};
const enhance = withObservables(
  ['episodeId'],
  ({ episodeId, database, episode }) => {
    if (('' + episodeId).indexOf('-') > -1) return {};
    return {
      episode: episodeId
        ? database
          .get('episodes')
          .findAndObserve(episodeId)
          .pipe(catchError((err, caught) => []))
        : of$(null),
      podcast: database
        .get('podcasts')
        .query(Q.on('episodes', 'id', Q.eq(episodeId))),
    };
  },
);
const PWChild = withDatabase(enhance(PlayerWidgetChild));
const PlayerWidget = () => {
  const episodeId = useSelector(episodeIdSelector, shallowEqual);
  return <PWChild episodeId={episodeId} />;
};
export default withDatabase(PlayerWidget);
