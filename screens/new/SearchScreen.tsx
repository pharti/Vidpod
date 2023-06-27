import { SearchBar } from 'react-native-elements';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Podcast } from '../../features/podcastsSlice';
import { Episode } from '../../features/episodesSlice';
import { PodcastItem } from '../../components/SearchItem/PodcastItem';
import { EpisodeItem } from '../../components/SearchItem/EpisodeItem';

import PodcastCategories from '../../components/PodcastCategories/new/PodcastCategories';
import { useSelector } from 'react-redux';
import { userSelector } from '../../features/userSlice';
import { useNavigation } from '@react-navigation/native';
const keyExtractor = item => item.type + item.id.toString();

const SearchScreen = () => {
  const [term, setTerm] = React.useState<string>('');
  const [results, setResults] = React.useState<Array<Podcast | Episode>>([]);
  const [fIndex, setFIndex] = React.useState(0);
  const [fetching, setFetching] = React.useState(false);
  const filters = ['Shows', 'Episodes', 'Shows & Episodes'];
  const types = ['shows', 'episodes', 'showsandepisodes'];
  const user = useSelector(userSelector);
  //   const { data, error } = useSWRNative(
  //     'https://yidpod.com/wp-json/wp/v2/categories?hideempty&exclude=81,97,1&orderby=count&per_page=50',
  //     fetcher,
  //   );
  const navigation = useNavigation();
  const flatListRef = useRef();
  const searchYidpod = (offset: any) =>
    fetch(
      'https://yidpod.com/wp-json/yidpod/v1/searches?new&search=' +
      term +
      '&type=' +
      types[fIndex] +
      '&offset=' +
      offset +
      '&user_id=' +
      (user.wp_user ? user.wp_user.ID : 0),
      { headers: { 'Cache-Control': 'max-age:30' }, cache: 'no-cache' },
    )
      .then(res => res.json())
      .then(({ episodes, products }) => {
        for (var i = 0; i < episodes.length; i++) {
          if (products.indexOf(episodes[i].id) > -1) {
            episodes[i].unlock = true;
          }
        }
        if (offset == 0) {
          setResults(episodes);
          setFetching(false);
        } else {
          setResults([...results, ...episodes]);
          setFetching(false);
        }
      })

      .catch(error => console.log(error));

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
      }, 300);

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
        renderItem={({ item, index }) => {
          // if (isEpisode(item)) {
          //   return <SongListItem item={item} index={index} />;
          // } else {
          if (item.type == 'podcast') {
            return <PodcastItem {...item} />;
          } else {
            return <EpisodeItem {...item} />;
          }
          // }
        }}
        ref={flatListRef}
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
