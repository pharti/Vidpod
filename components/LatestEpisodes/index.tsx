import React, { memo, useCallback, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import styles from '../AlbumCategory/styles';
import { SpecialEpisode } from '../SpecialCategories/SpecialCategory/SpecialEpisode/newindex';

import { firebase } from '@react-native-firebase/messaging';
import {
  latestepisodesSelector,
  setLatestEpisodes,
} from '../../features/updateSlice';
import { SeeMore } from '../AlbumCategory/SeeMore';
const keyExtractor = item => {
  return item.id;
};

const LatestEpisodes = props => {
  // const [episodes, setEpisodes] = useState([]);
  const dispatch = useDispatch();
  const latestepisodes = useSelector(latestepisodesSelector, shallowEqual);
  const mounted = useRef(true);
  const getNewEpisodes = async () => {
    const url = 'https://yidpod.com/wp-json/yidpod/v1/episodes?limit=7';
    fetch(url, {
      method: 'GET',
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(res => res.json())
      .then(e => {
        if (mounted.current) {
          dispatch(setLatestEpisodes(e));
        }
      });
  };
  const navigation = useNavigation();
  const seeMore = useCallback(() => {
    return (
      <SeeMore
        text={'View More Episodes'}
        navParams={{ id: '', term: '', terms: '' }}
        screen={'LatestEpisodesScreen'}
        navigation={navigation}
      />
    );
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (mounted.current) {
        getNewEpisodes();
      }
      const listener = firebase.messaging().onMessage(message => {
        if (mounted.current) {
          dispatch(setLatestEpisodes([message.data, ...latestepisodes]));
        }
      });
      return () => {
        listener();
      };
    }, []),
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'Latest Episodes'}</Text>
      <FlatList
        data={latestepisodes}
        extraData={latestepisodes}
        keyExtractor={keyExtractor}
        initialNumToRender={3}
        renderItem={useCallback(
          ({ item }) => (
            <SpecialEpisode item={item} />
          ),
          [],
        )}
        ListFooterComponent={seeMore}
        horizontal
      />
    </View>
  );
};
// const enhance = withObservables(['database'], ({ database }) => {
//   return {
//     episodes: database
//       .get('episodes')
//       .query(Q.sortBy('published_date', Q.desc), Q.take(7)),
//   };
// });
const areEqual = (prevProps, nextProps) => {
  return prevProps.refreshing == nextProps.refreshing;
};
export default memo(withDatabase(LatestEpisodes), areEqual);
