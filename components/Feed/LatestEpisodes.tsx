import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { userSelector } from '../../features/userSlice';
import EmptyList from '../EmptyList';
import FeedListItem from '../SongListItem/forfeed';
import SongListItem from '../SongListItem/forlastest';
const getLatestEpisodes = (user_id, subscribed, offset) => {
  return fetch(
    'https://yidpod.com/wp-json/yidpod/v2/getfeed?user_id=' +
      user_id +
      '&offset=' +
      offset,
    {
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(error => error);
};
const keyExtractor = item => item.id.toString();

const LatestEpisodes = props => {
  const user = useSelector(userSelector);
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const momentum = useRef(true);
  const [loading, setLoading] = useState(false);
  const subscribed = useRef(null);
  const navigation = useNavigation();
  const flatListRef = useRef();

  useEffect(() => {
    const g = async () => {
      setLoading(true);
      const results = await getLatestEpisodes(user.wp_user.ID, null, 0);
      setLoading(false);
      subscribed.current = results.subscribed;
      if (results.episodes) {
        setLatestEpisodes(results.episodes);
      }
    };
    g();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);
  const onEndReached = useCallback(
    async ({ distanceFromEnd }) => {
      if (distanceFromEnd < 0) return;
      if (!momentum.current) {
        setLoading(true);
        const { episodes } = await getLatestEpisodes(
          user.wp_user.ID,
          subscribed,
          latestEpisodes.length,
        );
        setLoading(false);
        setLatestEpisodes([...latestEpisodes, ...episodes]);
        momentum.current = true;
      }
    },
    [latestEpisodes.length],
  );
  return (
    <FlatList
      data={
        props.type == 'downloaded' || props.type == 'new'
          ? props.downloadedLatestEpisodes
          : latestEpisodes
      }
      style={{ paddingBottom: 50, marginBottom: 50 }}
      renderItem={useCallback(
        ({ item, index }) => {
          return props.type == 'downloaded' || props.type == 'new' ? (
            <FeedListItem
              item={item}
              index={index}
              isOpaque={false}
              podcast_title=""
              // iscurrentSong={currentSong.episode_id == item.id}
              // isplaying={currentSong.isplaying}
              playSong={props.onPressSong}
            />
          ) : (
            <SongListItem item={item} index={index} podcast_title="" />
          );
        },
        [props.type],
      )}
      initialNumToRender={10}
      keyExtractor={keyExtractor}
      refreshing={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      // onRefresh={props.refreshEpisodes}
      onMomentumScrollBegin={() => {
        momentum.current = false;
      }}
      ref={flatListRef}
      ListFooterComponent={
        loading ? <ActivityIndicator size={'large'} /> : null
      }
      ListEmptyComponent={
        <EmptyList
          messageString={
            props.type == 'downloaded' || props.type == 'new'
              ? 'There are no downloaded latest episodes'
              : "The latest episodes from podcasts you've subscribe to will appear her."
          }
        />
      }
    />
  );
};
const enhance = withObservables(
  ['database', 'latestEpisodes'],
  ({ database }) => ({
    downloadedLatestEpisodes: database
      .get('episodes')
      .query(
        Q.where('cachedUrl', Q.notEq('')),
        Q.sortBy('published_date', 'desc'),
      )
      .observe(),
  }),
);
export default withDatabase(enhance(LatestEpisodes));
