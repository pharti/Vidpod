import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Podcast } from '../../database/models/Podcast.model';
import AlbumHeader from '../AlbumHeader';
import SongListItem from '../SongListItem';

const songListItem = ({ item, index }) => {
  return (
    <SongListItem
      item={item}
      index={index}
      isOpaque={false}
    // realm={realm}
    // state={item.state}
    />
  );
};
const keyExtractor = item => item.id.toString();

const AlbumEpisodes = ({ episodes, podcast, termChanged, term }) => {
  const f = useRef(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [dontfetch, setDontfetch] = useState<boolean>(false); //
  const momentum = useRef(false);
  const mounted = useRef(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  useEffect(() => {
    if (episodes.length == 0) {
      fetchMoreEpisodes('>', '0');
    } else {
      const check_date = episodes[0].publishedDate;
      if (podcast.type && podcast.type.indexOf('audiobook') > -1) {
        fetchMoreEpisodes('<', check_date);
      } else {
        fetchMoreEpisodes('>', check_date);
      }
    }
    // getNotifications();
    return () => {
      mounted.current = false;
    };
  }, []);
  const onEndReached = () => {
    if (!fetching && !dontfetch && !momentum.current && !term) {
      if (episodes.length > 0) {
        const check_date = episodes[episodes.length - 1].publishedDate;
        momentum.current = true;
        if (podcast.type && podcast.type.indexOf('audiobook') > -1) {
          const episode = episodes[episodes.length - 1];

          fetchMoreEpisodes('>', check_date);
        } else {
          fetchMoreEpisodes('<', check_date);
        }
      }
    }
  };
  const fetchMoreEpisodes = (how: string, check_date: string) => {
    setFetching(true);
    const url =
      'https://yidpod.com/wp-json/yidpod/v1/episodes?podcast_id=' +
      podcast.id +
      '&published_date=' +
      check_date +
      '&how=' +
      how +
      (podcast.type && podcast.type.indexOf('audiobook') > -1
        ? '&audiobook='
        : '') +
      (term ? '&search=' + term : '');
    fetch(url, {
      headers: { 'cache-control': 'public, max-age=0' },
      cache: 'no-cache',
    })
      .then(response => {
        return response.json();
      })
      .then(async response => {
        const podcasts = response;
        if (mounted.current) {
          podcast.addEpisodes(podcasts);
          setFetching(false);
          setRefreshing(false);
          if (podcast.type && podcast.type.indexOf('audiobook') > -1) {
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
        // thunkApi.dispatch(setError(error.response.data.message));
      });
  };

  useEffect(() => {
    if (!term || term == '') {
      const timerId = setTimeout(() => {
        setDontfetch(false);
      }, 0);
      return () => {
        clearTimeout(timerId);
      };
    } else {
      // searchYidpod();
      const timerId = setTimeout(() => {
        // if (term) {
        if (!fetching) {
          setFetching(true);
          if (episodes.length > 0) {
            const check_date = episodes[episodes.length - 1].publishedDate;
            fetchMoreEpisodes('<', check_date);
          } else {
            fetchMoreEpisodes('>', '0');
          }
        }
        // } else {
        // if (results.length) {
        //   setResults([]);
        // }
        // }
        // make a request after 1 second since there's no typing
      }, 250);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [term]);
  return (
    <FlatList
      data={episodes}
      extraData={episodes}
      renderItem={songListItem}
      style={styles.list}
      keyExtractor={keyExtractor}
      initialNumToRender={10}
      onViewableItemsChanged={useCallback(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0 && !term) {
          const firstItemIndex = viewableItems[0].item.eIndex;
          const lastItemIndex =
            viewableItems[viewableItems.length - 1].item.eIndex;
          if (firstItemIndex - lastItemIndex != viewableItems.length - 1) {
            if (!f.current) {
              f.current = true;

              const where =
                'podcast_id = ' +
                podcast.id +
                ' and e_index < ' +
                firstItemIndex +
                ' and e_index > ' +
                lastItemIndex;
              fetch(
                'https://yidpod.com/wp-json/yidpod/v1/new-episodes?where=' +
                where,
                {
                  method: 'GET',
                },
              )
                .then(es => es.json())
                .then(response => {
                  podcast.addEpisodes(response);
                  f.current = false;
                });
            }
          }
        }
      }, [])}
      onEndReached={onEndReached}
      removeClippedSubviews={true}
      refreshing={refreshing}
      onRefresh={useCallback(() => {
        if (
          !fetching &&
          !dontfetch &&
          !refreshing &&
          episodes &&
          episodes.length > 0
        ) {
          setRefreshing(true);
          if (podcast.type && podcast.type.indexOf('audiobook') > -1) {
            const check_date = episodes[episodes.length - 1].publishedDate;

            fetchMoreEpisodes('>', check_date);
          } else {
            const check_date = episodes[0].publishedDate;

            fetchMoreEpisodes('>', check_date);
          }
          setFetching(true);
        }
      }, [fetching, dontfetch])}
      onMomentumScrollBegin={() => {
        momentum.current = false;
      }}
      onEndReachedThreshold={0.6}
      ListEmptyComponent={useCallback(
        () =>
          term ? (
            <View>
              <Text style={styles.notfound}>No results found for {term}</Text>
            </View>
          ) : (
            <ActivityIndicator size={'large'} color={'grey'} />
          ),
        [term],
      )}
      ListHeaderComponent={useCallback(
        () => (
          <AlbumHeader album={podcast} termChanged={termChanged} />
        ),
        [podcast.id],
      )}
      ListFooterComponent={useCallback(
        () =>
          fetching && episodes.length > 0 ? (
            <ActivityIndicator size={'large'} color={'grey'} />
          ) : null,
        [fetching, episodes.length],
      )}
    />
  );
};
const episodeEnhance = withObservables(
  ['podcast', 'database', 'term'],
  ({ podcast, database, term }) => {
    return {
      podcast: podcast,
      episodes: database.get('episodes').query(
        Q.where('podcast_id', podcast.id),
        Q.where('title', term ? Q.like('%' + term + '%') : Q.notEq('')),
        Q.sortBy(
          'published_date',
          podcast.type.indexOf('audiobook') > -1 ? Q.asc : Q.desc,
        ),
        // Q.sortBy(
        //   'e_index',
        //   podcast.type.indexOf('audiobook') > -1 ? Q.desc : Q.desc,
        // ),
      ),
    };
  },
);
export default withDatabase(episodeEnhance(AlbumEpisodes));
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1E22',
    flex: 1,
  },

  notfound: {
    color: 'white',
    textAlign: 'center',
  },
  list: { paddingBottom: 5 },
});
