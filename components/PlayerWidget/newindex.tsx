import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import {
  episodeSelector,
  podcastSelector,
  positionSelector,
  setCurrentSong,
  setPosition,
  setShow,
  setStatus,
  showSelector,
  statusSelector,
} from '../../features/currentSongSlice';
import styles from './styles';

import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import BackgroundTimer from 'react-native-background-timer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createEpisode,
  playEpisode,
  updatePosition,
} from '../../database/functions';
import PlayerScreen from '../../screens/PlayerScreen';
import EpisodeInfo from './EpisodeInfo';
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

const PlayerWidget = () => {
  const wasplaying = useRef(false);
  const background = useRef(0);
  const [error, setError] = useState(null);
  const database = useDatabase();
  const episode_id = useSelector(episodeSelector);
  const podcast_id = useSelector(podcastSelector);
  const status = useSelector(statusSelector);
  const show = useSelector(showSelector);
  const dispatch = useDispatch();

  const oldposition = useSelector(positionSelector, () => true);

  const marginBottom = useSafeAreaInsets().bottom;
  useEffect(() => {
    setError(null);
  }, [episode_id]);
  // const playSpeed = useSelector(playSpeedSelector);
  // const currentSong = useSelector(currentSongSelector);
  useTrackPlayerEvents(events, async event => {
    if (event.type == Event.PlaybackState) {
      if (event.state == State.Paused) {
        BackgroundTimer.clearInterval(background.current);
        background.current = 0;
        const position = await TrackPlayer.getPosition();
        dispatch(setStatus('paused'));
        if (episode_id) {
          updatePosition(episode_id, position);
        }
        // await episode.updatePosition(position);
      }
      if (event.state == State.Playing) {
        // if (Platform.OS == 'ios') {
        // await TrackPlayer.seekTo(episode.position);
        // }
        background.current = BackgroundTimer.setInterval(async () => {
          const state = await TrackPlayer.getState();
          if (state == State.Playing) {
            const position = await TrackPlayer.getPosition();
            dispatch(setPosition(position));
          }
        }, 1000);
        dispatch(setStatus('playing'));
        // await episode.playing();
      }
      if (event.state == State.Ready) {
        if (Platform.OS == 'ios') {
          await TrackPlayer.play();
        }

        if (status == 'buffering') {
          dispatch(setStatus('playing'));
          // await episode.updateState('playing');
        }
      }

      if (event.state == State.Buffering || event.state == State.Connecting) {
        dispatch(setStatus('buffering'));

        // await episode.updateState('buffering');
      }
    }
    if (event.type == Event.PlaybackError) {
      // Toast.show('Error loading file', ToastAndroid.LONG);
      Toast.show('Error loading file', Toast.LONG);
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
      // const position = await TrackPlayer.getPosition();
      // dispatch(setStatus('paused'));
      // await episode.updatePosition(position);
      await TrackPlayer.pause();
    }
    if (event.type == Event.RemoteStop) {
      // const position = await TrackPlayer.getPosition();
      // dispatch(setStatus('paused'));
      // await episode.updatePosition(position);
      // );
      await TrackPlayer.pause();
      await TrackPlayer.reset();
    }
    if (event.type == Event.RemotePrevious) {
      const episode = await database
        .get('episodes')
        .find('e' + episode_id.replace('e', ''));
      const prevEpisode = await database
        .get('episodes')
        .query(
          Q.where('podcast_id', podcast_id + ''),
          Q.where('e_index', episode.eIndex - 1),
        )
        .fetch();
      // const podcast = await database.get('podcasts').find(episode.podcast.id);
      if (prevEpisode.length > 0) {
        playEpisode(prevEpisode[0].id);
        dispatch(
          setCurrentSong({
            episode_id: prevEpisode[0].id,
            podcast_id: podcast_id,
          }),
        );
        dispatch(setPosition(prevEpisode[0].position));
      } else {
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          podcast_id +
          '&eindex=' +
          (episode.eIndex - 1) +
          '&how=<&limit=1&previous=';
        fetch(url, {
          headers: {
            'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
          },
        })
          .then(p => p.json())
          .then(async e => {
            // console.log(e);
            if (e.length) {
              await createEpisode(e[0], null);
              // const pe = await database
              //   .get('episodes')
              //   .query(
              //     Q.where('podcast_id', episode.podcast.id),
              //     Q.where('e_index', episode.eIndex - 1),
              //   );
              playEpisode(e[0].id);
              dispatch(
                setCurrentSong({
                  episode_id: e[0].id,
                  podcast_id: e[0].podcast_id,
                }),
              );
              dispatch(setPosition(0));
            }
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
      console.log(event);
      dispatch(setStatus('paused'));
      // if (event.track != undefined || event.track != null) {
      const episode = await database
        .get('episodes')
        .find('e' + episode_id.replace('e', ''));
      //   const nextEpisode = await database
      //     .get('episodes')
      //     .query(
      //       Q.where('podcast_id', podcast_id + ''),
      //       Q.where('e_index', episode.eIndex + 1),
      //     )
      //     .fetch();
      //   // const podcast = await database.get('podcasts').find(episode.podcast.id);
      //   if (nextEpisode.length > 0) {
      //     playEpisode(nextEpisode[0].id);

      //     dispatch(
      //       setCurrentSong({
      //         episode_id: nextEpisode[0].id,
      //         podcast_id: nextEpisode[0].podcast.id + '',
      //       }),
      //     );
      //     dispatch(setPosition(nextEpisode[0].position));
      //   } else {
      const url =
        'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
        podcast_id +
        '&eindex=' +
        (episode.eIndex + 1) +
        '&how=>&limit=1&next=';

      fetch(url, {
        headers: {
          'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
        },
      })
        .then(p => p.json())
        .then(async e => {
          if (e.length) {
            await createEpisode(e[0], null);
            // const pe = await database
            //   .get('episodes')
            //   .query(
            //     Q.where('podcast_id', episode.podcast.id),
            //     Q.where('e_index', episode.eIndex - 1),
            //   );
            playEpisode(e[0].id);
            dispatch(
              setCurrentSong({
                episode_id: e[0].id,
                podcast_id: e[0].podcast_id,
              }),
            );
            dispatch(setPosition(0));
          }
        });
    }
    //   const nextEpisode = await database
    //     .get('episodes')
    //     .query(
    //       Q.where('podcast_id', episode.podcast.id),
    //       Q.where('e_index', episode.eIndex + 1),
    //     );
    //   const podcast = await database.get('podcasts').find(episode.podcast.id);
    //   if (nextEpisode.length > 0) {
    //     await addTrack(
    //       nextEpisode[0],
    //       podcast.title,
    //       nextEpisode[0].position,
    //   );
    //   dispatch(setCurrentSong(nextEpisode[0].id));
    //   dispatch(setPosition(nextEpisode[0].position));
    //   // dispatch(setStatus("playing"));

    //   // await nextEpisode[0].updateState('playing');
    // } else {
    //   const url =
    //     'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
    //     episode.podcast.id +
    //     '&published_date=' +
    //     episode.publishedDate +
    //     '&how=>&limit=1&next=';
    //   fetch(url)
    //     .then(p => p.json())
    //     .then(async e => {
    //       if (e && e.length) {
    //         await podcast.addEpisodes(e);
    //         const ne = await database
    //           .get('episodes')
    //           .query(
    //             Q.where('podcast_id', episode.podcast.id),
    //             Q.where('e_index', episode.eIndex + 1),
    //           );
    //         if (ne && ne.length) {
    //           await addTrack(ne[0], podcast.title, 0);
    //           // await ne[0].updateState('playing');

    //           dispatch(setCurrentSong(ne[0].id));
    //           dispatch(setPosition(ne[0].position));
    //         }
    //       }
    //     });
    // }
    // }
    // }
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
        if (prevTrack) {
          // const oldepisode = await database.get('episodes').find(prevTrack.id);
          // dispatch(setStatus("paused"));
          updatePosition(prevTrack.id, event.position);
        }
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
      // const nextEpisode = await database
      //   .get('episodes')
      //   .query(
      //     Q.where('podcast_id', episode.podcast.id),
      //     Q.where('e_index', episode.eIndex + 1),
      //   );
      // const podcast = await database.get('podcasts').find(episode.podcast.id);
      // if (nextEpisode.length > 0) {
      //   await addTrack(nextEpisode[0], podcast.title, nextEpisode[0].position);
      //   dispatch(setCurrentSong(nextEpisode[0].id));
      //   dispatch(setPosition(nextEpisode[0].position));
      // } else {
      // const url =
      //   'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
      //   podcast_id +
      //   '&published_date=' +
      //   episode.publishedDate +
      //   '&how=>&limit=1&next=';
      // fetch(url)
      //   .then(p => p.json())
      //   .then(async e => {
      //     await createEpisode(e);
      // }

      const episode = await database
        .get('episodes')
        .find('e' + episode_id.replace('e', ''));
      const nextEpisode = await database
        .get('episodes')
        .query(
          Q.where('podcast_id', podcast_id + ''),
          Q.where('e_index', episode.eIndex + 1),
        )
        .fetch();

      // const podcast = await database.get('podcasts').find(episode.podcast.id);
      if (nextEpisode.length > 0) {
        playEpisode(nextEpisode[0].id);
        dispatch(
          setCurrentSong({
            episode_id: nextEpisode[0].id,
            podcast_id: nextEpisode[0].podcast_id,
          }),
        );
        dispatch(setPosition(nextEpisode[0].position));
      } else {
        const url =
          'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
          podcast_id +
          '&eindex=' +
          (episode.eIndex + 1) +
          '&how=<&limit=1&next=';

        fetch(url, {
          headers: {
            'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
          },
        })
          .then(p => p.json())
          .then(async e => {
            if (e.length) {
              await createEpisode(e[0], null);
              // const pe = await database
              //   .get('episodes')
              //   .query(
              //     Q.where('podcast_id', episode.podcast.id),
              //     Q.where('e_index', episode.eIndex - 1),
              //   );
              playEpisode(e[0].id);
              dispatch(
                setCurrentSong({
                  episode_id: e[0].id,
                  podcast_id: e[0].podcast_id + '',
                }),
              );
              dispatch(setPosition(0));
            }
          });
      }
    }
    if (event.type == Event.RemoteDuck) {
      if (event.permanent) {
        TrackPlayer.pause().then(() => {
          TrackPlayer.getPosition().then(async (value: number) => {
            const oldepisode = await database.get('episodes').find(episodeId);
            updatePosition(oldepisode.id, value);
            // await oldepisode.updatePosition(value);
          });
        });
      } else {
        if (event.paused) {
          wasplaying.current = status == 'playing';

          TrackPlayer.pause().then(() => {
            TrackPlayer.getPosition().then(async (value: number) => {
              const oldepisode = await database
                .get('episodes')
                .find('e' + episode_id.replace('e', ''));
              await oldepisode.paused(value);
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
      if (episode_id) {
        dispatch(setStatus('paused'));
        updatePosition(episode_id, oldposition);
        // await episode.updateState('paused');
      }
    };
    updatestate();
    return () => {};
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
    // const podcast = await database.get('podcasts').find(episode.podcast.id);
  }, [episode_id]);
  if (!episode_id) {
    return null;
  }
  if (episode_id != '' && show) {
    return (
      <View
        style={[
          styles.container,
          {
            bottom: Platform.OS == 'ios' ? 0 : styles.container.bottom,
          },
        ]}>
        <PlayerBar />
        <View style={styles.innerContainer}>
          <EpisodeInfo
            show={onPress}
            episode_id={episode_id}
            podcast_id={podcast_id}
          />
          <View
            style={{
              position: 'relative',
              width: 60,
              height: 60,
            }}>
            <View style={styles.playArrows}>
              <PlayerPlayButton
                addCurrentTrack={addCurrentTrack}
                id={episode_id}
              />
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    if (!show && episode_id != '') {
      return (
        <PlayerScreen
          // position={position}
          episode_id={episode_id}
          podcast_id={podcast_id}
          bottom={
            Platform.OS == 'ios' ? marginBottom - 5 : styles.container.bottom
          }
        />
      );
    }
    return null;
  }
};
// const enhance = withObservables(
//   ['episodeId'],
//   ({ episodeId, database, episode }) => {
//     if (('' + episodeId).indexOf('-') > -1) return {};
//     return {
//       episode: episodeId
//         ? database
//             .get('episodes')
//             .findAndObserve(episodeId)
//             .pipe(catchError((err, caught) => []))
//         : of$(null),
//     };
//   },
// );
// const PWChild = (PlayerWidgetChild);
// const PlayerWidget = () => {
//   const episodeId = useSelector(episodeIdSelector, shallowEqual);
//   return <PWChild episodeId={episodeId} />;
// };
export default withDatabase(PlayerWidget);
