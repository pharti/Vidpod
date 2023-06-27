import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import LatestEpisodes from '../../components/Feed/LatestEpisodes';
import ListeningHistory from '../../components/Feed/ListeningHistory';
import { FilterButton } from '../../components/FilterButton';
import { mySync } from '../../database/sync';
import {
  setCurrentSong,
  setPosition,
  setShow,
  setStatus,
} from '../../features/currentSongSlice';
import {
  generalSelector,
  setFilter,
  setSyncing,
  setToast,
} from '../../features/generalSlice';
import { userSelector } from '../../features/userSlice';

const Feed = props => {
  // const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //   (podcast) => podcast.subscribed,
  // );
  // const listeningHistory = [];
  const route = useRoute();
  const navigation = useNavigation();
  const latestEpisodes = [];
  const isFocused = useIsFocused();
  // const currentSong = useSelector(currentSongSelector, shallowEqual);
  const dispatch = useDispatch();
  const database = useDatabase();
  // TODO - need to figure out a way to get new episodes here. As of now new episodes are only being fetch if they
  // refresh in the AlbumScreen. Look there.

  // const latestEpisodes = useSelector((state) => {
  //   return selectAllEpisodes(state).filter((episode) => {
  //     return podcasts.some((podcast) => {
  //       return (
  //         podcast.subscribed &&
  //         podcast.id == episode.podcast_id &&
  //         podcast.subscribed <= parseInt(episode.published_date)
  //       );
  //     });
  //   });
  // }).sort((a, b) => {
  //   return b.published_date > a.published_date ? 1 : -1;
  // });
  // const listeningHistory = useSelector((state) => {
  //   return selectAllEpisodes(state).filter((episode) => {
  //     if (episode) {
  //       return episode.playDate;
  //     }
  //   });
  // }).sort((a, b) => {
  //   return b.playDate > a.playDate ? 1 : -1;
  // });

  //   const episodes = useSelector((state) =>
  //     selectAllEpisodes(state)
  //       .filter(
  //         (e) =>
  //           getPodcastSubscribeDate(e.podcast_id) <
  //           new Date(e.published_date + 86400000),
  //       )
  //       .sort((a, b) => b.published_date - a.published_date),
  //   );
  const general = useSelector(generalSelector);
  const user = useSelector(userSelector);
  // const [type, setType] = useState(route.params?.to ? route.params.to : 'all');
  const [activeButton, setActiveButton] = useState<'Latest' | 'History'>(
    'Latest',
  );
  const onPressLatest = () => {
    setActiveButton('Latest');
  };
  const onPressHistory = () => {
    setActiveButton('History');
  };
  const onPressSong = useCallback(async song => {
    const trackIndex = await TrackPlayer.getCurrentTrack();
    let track = null;
    if (trackIndex != null) {
      track = await TrackPlayer.getTrack(trackIndex);
    }
    if (!track || track.id != song.id) {
      //   await addTrack(song, song.podcast.title, song.position);
      dispatch(setCurrentSong(song.id));
      dispatch(setPosition(song.position));

      // dispatch(
      //   updateEpisode({
      //     id: song.podcast_id + '-' + song.e_index,
      //     changes: { playDate: new Date().getTime(), state: 'playing' },
      //   }),
      // );
      dispatch(setStatus('playing'));

      // await song.updateState('buffering');
      await TrackPlayer.play();
      dispatch(setStatus('playing'));
    }

    if (track && track.id == song.id) {
      if (song.state == 'playing') {
        // dispatch(
        //   updateEpisode({
        //     id: song.podcast_id + '-' + song.e_index,
        //     changes: { state: 'paused' },
        //   }),
        // );
        // await song.updateState('paused');
        await TrackPlayer.pause();
        dispatch(setStatus('paused'));
      } else {
        // dispatch(
        //   updateEpisode({
        //     id: song.podcast_id + '-' + song.e_index,
        //     changes: { playDate: new Date().getTime(), state: 'playing' },
        //   }),
        // );
        // await song.updateState('buffering');

        await TrackPlayer.play();
        dispatch(setStatus('playing'));
      }
    }

    dispatch(setShow(true));
  }, []);
  const fetchNewEpisodes = async () => {
    return new Promise(async (resolve, reject) => {
      if (general.syncing) {
        resolve(true);
      } else {
        dispatch(setSyncing(true));
        mySync(database, user.wp_user ? user.wp_user.ID : null);
        dispatch(setSyncing(false));
        resolve(true);
      }
    });
  };
  const refreshEpisodes = useCallback(() => {
    // fetchNewEpisodes();
  }, []);
  useEffect(() => {
    if (!isFocused) {
      dispatch(setFilter('all'));
    }
  }, [isFocused]);
  useEffect(() => {
    dispatch(setToast(null));
  }, []);

  useEffect(() => {
    if (route.params?.to) {
      dispatch(setFilter(route.params?.to));
      dispatch(setToast(null));
    }
  }, [route.params?.date]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: props => <FilterButton type={general.filter} />,
    });
  }, [general]);

  return (
    <View style={{ flex: 1, paddingBottom: 25 }}>
      {/* <FilterButton  /> */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onPressLatest}>
          <View
            style={[
              styles.activeButtonContainer,
              activeButton == 'Latest' ? styles.activeButton : null,

              // activeButton === 'Latest' && { backgroundColor: '#1DB954' },
            ]}>
            <Text style={[styles.activeButtons]}>Latest Episodes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHistory}>
          <View
            style={[
              styles.activeButtonContainer,
              activeButton == 'History' ? styles.activeButton : null,
            ]}>
            <Text
              style={[
                styles.activeButtons,
                {
                  borderLeftWidth: 1,
                  // borderLeftColor: '#333',
                  paddingLeft: 5,
                },
                ,
              ]}>
              Listening History
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {activeButton == 'History' ? (
          <ListeningHistory type={general.filter} onPressSong={onPressSong} />
        ) : (
          <LatestEpisodes type={general.filter} onPressSong={onPressSong} />
        )}
      </View>
    </View>
  );
};

export default withDatabase(Feed);

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
  },
  activeButtonContainer: {
    color: 'white',
    // padding: 10,
    // borderColor: 'white',
    backgroundColor: 'black',
  },
  activeButtons: {
    color: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    textDecorationColor: '#1DB954',
    paddingBottom: 15,

    // backgroundColor: '#1DB954',
  },
  activeButton: {
    color: 'white',
    borderBottomColor: '#1DB954',
    borderBottomWidth: 1,
  },
});
