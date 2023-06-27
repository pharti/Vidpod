import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { EpisodeItem } from '../components/SearchItem/EpisodeItem';
import { PodcastItem } from '../components/SearchItem/PodcastItem';
import { Episode } from '../features/episodesSlice';
import { Podcast } from '../features/podcastsSlice';
const keyExtractor = item => item.type + item.id.toString();

import PodcastCategories from '../components/PodcastCategories/new/PodcastCategories';
const Item = ({ item, index }) => {
  // if (isEpisode(item)) {
  //   return <SongListItem item={item} index={index} />;
  // } else {
  if (item.type == 'podcast') {
    return <PodcastItem {...item} />;
  } else {
    return <EpisodeItem {...item} />;
  }
  // }
};
const SearchScreen = () => {
  const [term, setTerm] = React.useState<string>('');
  const [results, setResults] = React.useState<Array<Podcast | Episode>>([]);
  const [fIndex, setFIndex] = React.useState(0);
  const [fetching, setFetching] = React.useState(false);
  const filters = ['Shows', 'Episodes', 'Shows & Episodes'];
  const types = ['shows', 'episodes', 'showsandepisodes'];
  const searchYidpod = (offset: any) =>
    fetch(
      'https://yidpod.com/wp-json/yidpod/v1/searches?search=' +
        term +
        '&type=' +
        types[fIndex] +
        '&offset=' +
        offset,
      { headers: { 'Cache-Control': 'max-age:30' }, cache: 'no-cache' },
    )
      .then(res => res.json())
      .then((podcasts: Array<Podcast>) => {
        if (offset == 0) {
          setResults(podcasts);
          setFetching(false);
        } else {
          setResults([...results, ...podcasts]);
          setFetching(false);
        }
      })
      .catch(error => console.log(error));
  useEffect(() => {
    if (!term || term == '') {
      const timerId = setTimeout(() => {
        setResults([]);
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
          searchYidpod(0);
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
  // const isEpisode = (item: Podcast | Episode) => {
  //   return (item as Episode).podcast_id !== undefined;
  // };
  useEffect(() => {
    if (!fetching && term && term != '') {
      setFetching(true);
      searchYidpod(0);
    }
  }, [fIndex]);
  return (
    <View style={styles.container}>
      {fetching ? (
        <View
          style={{
            backgroundColor: 'black',
            opacity: 0.5,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={'grey'} />
        </View>
      ) : null}
      <SearchBar
        placeholder="Type Here..."
        onChangeText={newText => {
          setTerm(newText);
        }}
        clearIcon={{ iconStyle: { paddingLeft: 15 } }}
        value={term}
      />
      <View style={styles.row}>
        {filters.map((filter, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setFIndex(index);
                // setTerm('');
                // setResults([]);
              }}>
              <Text
                style={[
                  styles.filterItem,
                  fIndex == index ? styles.filterPicked : null,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={results}
        extraData={results}
        renderItem={Item}
        onEndReached={() => {
          if (!fetching) {
            setFetching(true);
            searchYidpod(results.length);
          }
        }}
        keyExtractor={keyExtractor}
        ListEmptyComponent={useCallback(
          () => (
            <PodcastCategories />
          ),
          [],
        )}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  filterItem: {
    borderWidth: 1,
    // marginRight: 10,
    marginLeft: 10,
    padding: 10,
    borderColor: 'white',
    color: 'white',
    borderRadius: Platform.OS == 'ios' ? 20 : 90,
    overflow: 'hidden',
  },
  filterPicked: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
});
