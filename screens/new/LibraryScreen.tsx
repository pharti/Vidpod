import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
// import { selectAllEpisodes } from '../features/episodesSlice';
// import { selectAllPodcasts } from '../features/podcastsSlice';
// import FeedEpisode from '../components/FeedEpisode';
// import SongListItem from '../components/SongListItem';
import { useDispatch } from 'react-redux';
// import { Podcast, selectById, updatePodcast } from '../features/podcastsSlice';
import AlbumComponent from '../..//components/Album/newindex';
import EmptyList from '../../components/EmptyList';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { userSelector } from '../../features/userSlice';
const keyExtractor = item => item.id.toString();

const LibraryScreen = () => {
  const dispatch = useDispatch();
  const [podcasts, setPodcasts] = useState([]);
  //   const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //     (e) => e.subscribed,
  //   );
  const [loading, setLoading] = useState(false);
  const user = useSelector(userSelector);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const flatListRef = useRef();
  function fetchSubscribed() {
    fetch(
      'https://yidpod.com/wp-json/yidpod/v2/subscribed?user_id=' +
      user.wp_user.ID +
      '&offset=' +
      podcasts.length,
      {
        headers: {
          'cache-control': 'public, max-age=0,stale-while-revalidate=86400',
        },
      },
    )
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        setPodcasts([...podcasts, ...res]);
      });
  }
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

  useEffect(() => {
    if (isFocused && user.wp_user && user.wp_user.ID) {
      setLoading(true);
      fetch(
        'https://yidpod.com/wp-json/yidpod/v2/subscribed?user_id=' +
        user.wp_user.ID +
        '&offset=' +
        podcasts.length,
        {
          headers: {
            'cache-control': 'public, max-age=0,stale-while-revalidate=86400',
          },
        },
      )
        .then(res => res.json())
        .then(res => {
          setLoading(false);
          setPodcasts(res);
        });
    }
  }, [isFocused]);
  return (
    <View style={styles.container}>
      {!loading ? (
        <FlatList
          data={podcasts}
          //Not needed
          // extraData={podcasts}
          onEndReached={fetchSubscribed}
          onEndReachedThreshold={0.6}
          ref={flatListRef}
          renderItem={({ item }) => <AlbumComponent album={item} />}
          keyExtractor={keyExtractor}
          numColumns={2}
          ListEmptyComponent={
            <EmptyList
              messageString={'Podcasts you subscribe to will appear here.'}
            />
          }
        />
      ) : (
        <ActivityIndicator size={'large'} />
      )}
    </View>
  );
};
// const enhance = withObservables(['podcasts'], ({ database }) => ({
//   podcasts: database.get('podcasts').query(Q.where('subscribed', Q.gt(0))),
// }));
export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
});
