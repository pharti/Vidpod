import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { RouteProp } from '@react-navigation/native';

import { useDatabase } from '@nozbe/watermelondb/hooks';
import { StyleSheet } from 'react-native';
import AlbumHeader from '../../components/AlbumHeader/newindex';
import { SongListItem } from '../../components/SongListItem/newindex';
import { createPodcast, updatePodcast } from '../../database/functions';
import { firebase } from '@react-native-firebase/messaging';
import { Comment } from '../../components/Comment';

const AlbumScreen = () => {
  const route: RouteProp<
    {
      params: {
        feedlink: string;
        id: number;
        title: string;
        image_uri: string;
        album: any;
        type: any;
        subscribed: boolean;
      };
    },
    'params'
  > = useRoute();
  // const realm = useRealm();
  const database = useDatabase();
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [dontfetch, setDontfetch] = useState(false);
  const [term, setTerm] = useState('');
  const [episodes, setEpisodes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const momentum = useRef(true);
  const f = useRef(false);
  const [podcast, setPodcast] = useState(route.params);
  const [comments, setComments] = useState([]);

  const [showComments, setShowComments] = useState(false);
  // const  episodesFiltered= createSelector([selectAllEpisodes],(episodes)=>episodes
  // const [episodes, setEpisodes] = useState(
  //   realm.objectForPrimaryKey('Podcast', route.params?.id).episodes,
  // );

  // const filterEpisodes = episodes
  //   .filter((e) => e && e.podcast_id == route.params.id)
  //   .sort();
  // const podcast = realm.objectForPrimaryKey('Podcast', route.params?.id);
  const fetchMoreEpisodes = (how: string, check_date: string) => {
    setLoading(true);

    const url =
      'https://yidpod.com/wp-json/yidpod/v2/episodes?podcast_id=' +
      route.params.id +
      '&published_date=' +
      check_date +
      '&limit=10&how=' +
      how +
      (route.params.type && route.params.type.indexOf('audiobook') > -1
        ? '&audiobook='
        : '') +
      (term ? '&search=' + term : '');
    fetch(url, {
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        const podcasts = response;

        if (mounted.current) {
          if (term && term != '') {
            if (how == '>') {
              setEpisodes(old => [...podcasts, ...old]);
            } else {
              setEpisodes(old => [...old, ...podcasts]);
            }
          } else {
            if (how == '>') {
              setEpisodes(old => [...podcasts, ...old]);
            } else {
              setEpisodes(old => [...old, ...podcasts]);
            }
          }
          //   podcast.addEpisodes(podcasts);
          setLoading(false);
          //   setRefreshing(false);
          if (
            route.params.type &&
            route.params.type.indexOf('audiobook') > -1
          ) {
            if (podcasts.length < 10 && how == '>') {
              setDontfetch(true);
            }
          } else {
            if (podcasts.length < 10 && how == '<') {
              setDontfetch(true);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
        // thunkApi.dispatch(setError(error.response.data.message));
      });
  };
  const fetchMoreComments = (how: string, check_date: string) => {
    setLoading(true);
    console.log(route.params.id);
    const url =
      'https://yidpod.com/wp-json/yidpod/v2/podcast_comments?podcast_id=' +
      route.params.id;
    console.log(url);
    fetch(url, {
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(response => {
        console.log(response);

        return response.json();
      })
      .then(response => {
        const podcasts = response;
        console.log(podcasts);
        if (mounted.current) {
          setComments(podcasts);
          //   podcast.addEpisodes(podcasts);
          setLoading(false);
          //   setRefreshing(false);
          // if (
          //   route.params.type &&
          //   route.params.type.indexOf('audiobook') > -1
          // ) {
          //   if (podcasts.length < 10 && how == '>') {
          //     setDontfetch(true);
          //   }
          // } else {
          //   if (podcasts.length < 10 && how == '<') {
          //     setDontfetch(true);
          //   }
          // }
        }
      })
      .catch(error => {
        console.log(error);
        // thunkApi.dispatch(setError(error.response.data.message));
      });
  };
  const commentsClicked = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchMoreComments('', '');
    }
  };
  const ListHeaderComponent = useCallback(
    () => (
      <AlbumHeader
        album={route.params}
        termChanged={setTerm}
        commentsClicked={commentsClicked}
        showComments={showComments}
      />
    ),
    [route.params.id, showComments],
  );
  const Item = useCallback(
    ({ item }) => {
      if (showComments) {
        return <Comment {...item} />;
      }
      return <SongListItem item={item} podcast={route.params} key={item.id} />;
    },
    [showComments],
  );
  const onEndReached = useCallback(
    ({ distanceFromEnd }) => {
      if (distanceFromEnd < 0) return;
      if (!momentum.current) {
        if (!showComments) {
          fetchMoreEpisodes('<', episodes[episodes.length - 1].published_date);
        }
        momentum.current = true;
      }
    },
    [episodes.length, showComments],
  );
  const onRefresh = useCallback(() => {
    if (showComments) {
      if (episodes.length) {
        fetchMoreEpisodes('>', episodes[0].published_date);
      } else {
        fetchMoreEpisodes('>', 0);
      }
    }
  }, [episodes.length, showComments]);
  useEffect(() => {
    if ((term && term != '') || episodes.length == 0) {
      setEpisodes([]);
      fetchMoreEpisodes('>', 0);
    } else {
      fetchMoreEpisodes('>', episodes[0].published_date);
    }
  }, [term]);

  useEffect(() => {
    const create_album = () => {
      database
        .get('podcasts')
        .find(route.params.id + '')
        .then(a => {
          updatePodcast(podcast);
        })
        .catch(async error => {
          await createPodcast(podcast);
        });
    };
    create_album();

    const listener = firebase.messaging().onMessage(message => {
      if (!term) {
        if (message.data.podcast_id == route.params?.id + '') {
          setEpisodes(old => [message.data, ...old]);
        }
      }
    });
    return () => {
      listener();
    };
  }, []);

  // useEffect(() => {
  //   // if (term) {
  //   setEpisodes([]);
  //   console.log('term');
  //   fetchMoreEpisodes('>', 0);
  //   // }
  // }, [term]);
  return (
    <FlatList
      data={showComments ? comments : episodes}
      extraData={showComments ? comments : episodes}
      renderItem={Item}
      ListHeaderComponent={ListHeaderComponent()}
      onEndReached={onEndReached}
      initialNumToRender={10}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.6}
      //   removeClippedSubviews={true}
      onMomentumScrollBegin={() => {
        momentum.current = false;
      }}
      refreshing={loading}
    />
  );
};

export default AlbumScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1E22',
    flex: 1,
  },
  list: { paddingBottom: 5 },
});
