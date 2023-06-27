import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import EmptyList from '../components/EmptyList';
import { FilterButton } from '../components/FilterButton';
import SongListItem from '../components/SongListItem';
import { mySync } from '../database/sync';
import {
  setCurrentSong,
  setPosition,
  setShow,
  setStatus,
} from '../features/currentSongSlice';
import { generalSelector, setSyncing } from '../features/generalSlice';
import { userSelector } from '../features/userSlice';
import { addTrack } from '../js/trackFunctions';
const keyExtractor = item => item.id.toString();

const Feed = ({
  latestEpisodes,
  listeningHistory,
  downloadedLatestEpisodes,
  downloadedListeningHistory,
}) => {
  // const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //   (podcast) => podcast.subscribed,
  // );
  // const listeningHistory = [];
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
  const [type, setType] = useState('all');
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
      await addTrack(song, song.podcast.title, song.position);
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
    fetchNewEpisodes();
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: 25 }}>
      <FilterButton changed={t => setType(t)} type={type} />
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
          <FlatList
            data={type == 'all' ? listeningHistory : downloadedListeningHistory}
            extraData={
              type == 'all' ? listeningHistory : downloadedListeningHistory
            }
            renderItem={useCallback(({ item, index }) => {
              return (
                <SongListItem
                  item={item}
                  index={index}
                  isOpaque={false}
                  // iscurrentSong={currentSong.episode_id == item.id}
                  // isplaying={currentSong.isplaying}
                  podcast_title=""
                  playSong={onPressSong}
                />
              );
            }, [])}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <EmptyList
                messageString={
                  type == 'downloaded'
                    ? 'There are no downloaded episodes that you have listened to'
                    : 'The latest episodes you have listened to will appear here.'
                }
              />
            }
          />
        ) : (
          <FlatList
            data={
              type == 'downloaded' ? downloadedLatestEpisodes : latestEpisodes
            }
            extraData={
              type == 'downloaded' ? downloadedLatestEpisodes : latestEpisodes
            }
            style={{ paddingBottom: 50, marginBottom: 50 }}
            renderItem={useCallback(({ item, index }) => {
              return (
                <SongListItem
                  item={item}
                  index={index}
                  isOpaque={false}
                  podcast_title=""
                  // iscurrentSong={currentSong.episode_id == item.id}
                  // isplaying={currentSong.isplaying}
                  playSong={onPressSong}
                />
              );
            }, [])}
            keyExtractor={keyExtractor}
            refreshing={false}
            onRefresh={refreshEpisodes}
            ListEmptyComponent={
              <EmptyList
                messageString={
                  type == 'downloaded'
                    ? 'There are no downloaded latest episodes'
                    : "The latest episodes from podcasts you've subscribe to will appear here."
                }
              />
            }
          />
        )}
      </View>
    </View>
  );
};
const enhance = withObservables(
  ['database', 'latestEpisodes'],
  ({ database }) => ({
    latestEpisodes: database
      .get('episodes')
      .query(
        // Q.where('subscribed', Q.gt(0)),
        // Q.on('podcasts', Q.where('subscribed', Q.gt(0))),

        Q.sortBy('published_date', 'desc'),
        Q.unsafeSqlExpr(
          `"episodes"."published_date" > "podcasts"."subscribed" - 86400`,
        ),
      )

      .observe(),
    downloadedLatestEpisodes: database
      .get('episodes')
      .query(
        Q.where('cachedUrl', Q.notEq('')),
        Q.sortBy('published_date', 'desc'),
      ),
    // latestPodcasts: database
    //   .get('podcasts')
    //   .query(Q.where('subscribed', Q.gt(0))),
    listeningHistory: database
      .get('episodes')
      .query(Q.where('playDate', Q.notEq(0)), Q.sortBy('playDate', Q.desc)),
    downloadedListeningHistory: database
      .get('episodes')
      .query(
        Q.where('playDate', Q.notEq(0)),
        Q.where('cachedUrl', Q.notEq('')),
        Q.sortBy('playDate', Q.desc),
      ),
    // .fetch(),
  }),
);
export default withDatabase(enhance(Feed));

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
