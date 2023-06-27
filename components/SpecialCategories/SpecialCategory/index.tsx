import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setTermEpisodes, Updates } from '../../../features/updateSlice';
import { SeeMore } from '../../AlbumCategory/SeeMore';
import styles from '../../AlbumCategory/styles';
import { SpecialEpisode } from './SpecialEpisode/newindex';
const keyExtractor = item => {
  return item.id;
};

const SpecialCategory = ({ term, terms }) => {
  // const [episodes, setEpisodes] = useState([]);
  const mounted = useRef(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const episodes = useSelector(
    (state: { update: Updates }) => state.update.terms[term],
  );
  const getEpisodes = () => {
    const url =
      'https://yidpod.com/wp-json/yidpod/v1/searches?search=' +
      term +
      '&type=episodes' +
      '&offset=' +
      0 +
      '&limit=7&d=' +
      new Date().getTime();
    fetch(url, {
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(e => e.json())
      .then(theepisodes => {
        if (mounted.current) {
          dispatch(setTermEpisodes({ term, episodes: theepisodes }));
        }
      })
      .catch(error => console.log(error));
  };
  useEffect(() => {
    getEpisodes();
    return () => {
      mounted.current = false;
    };
  }, []);
  const seeMore = useCallback(() => {
    return (
      <SeeMore
        text={'View More Episodes'}
        navParams={{ id: '', term: term, terms: terms }}
        screen={'SpecialCategoryScreen'}
        navigation={navigation}
      />
    );
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={useCallback(() => {
          navigation.navigate('SpecialCategoryScreen', {
            term: term,
            terms: terms,
          });
        }, [])}>
        <Text style={styles.title}>{term}</Text>
      </TouchableOpacity>
      <FlatList
        data={episodes}
        extraData={episodes}
        keyExtractor={keyExtractor}
        initialNumToRender={3}
        renderItem={useCallback(
          ({ item }) => (
            <SpecialEpisode item={item} term={term} terms={terms} />
          ),
          [],
        )}
        ListFooterComponent={seeMore}
        horizontal
      />
    </View>
  );
};
export default withDatabase(SpecialCategory);
