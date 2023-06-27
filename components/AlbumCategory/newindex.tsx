import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import AlbumComponent from '../Album/newindex';

import { Album } from '../../types';
import styles from './styles';
import podcastsSlice, { Podcast } from '../../features/podcastsSlice';
import { useRealm, useRealmObjectsQuery } from 'react-realm-ctx';
import withObservables from '@nozbe/with-observables';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useNavigation } from '@react-navigation/core';
import { SeeMore } from './SeeMore';
import { useDispatch, useSelector } from 'react-redux';
import { setPodcastsForCategory } from '../../features/updateSlice';
import { SpecialEpisode } from '../SpecialCategories/SpecialCategory/SpecialEpisode/newindex';

export type AlbumCategoryProps = {
  id: number;
  title: string;
  accessToken: string;
  updateCount: any;
};
const keyExtractor = item => item.id.toString();

const AlbumCategory = props => {
  const { category, index } = props;
  const episodeRender = useCallback(
    ({ item }) => <SpecialEpisode item={item} />,
    [],
  );
  // const realm = useRealm();
  //   const [albums, setAlbums] = useState([]);
  // const albums = useSelector(state => state.update.categories[category.cat_ID]);

  //   const albumss = [];
  //   return (
  //     <View>
  //       <Text>Hello</Text>
  //     </View>
  //   );
  //   const albums = category.podcasts ? category.podcasts : [];
  const albumRender = useCallback(({ item, index }) => {
    // <View>
    //   <Text style={{ color: 'white' }}>{item.title}</Text>
    // </View>

    return (
      <AlbumComponent
        album={item}
        // updateAlbumCount={updateAlbumCount}
        key={index}
      />
    );
    // return (
    //   <TouchableOpacity onPress={() => }>
    //     <Text style={{ color: 'white' }}>{item.title}</Text>
    //   </TouchableOpacity>
    // );
  }, []);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const count = useRef(0);
  // const albums = realm.objectForPrimaryKey('Category', id).podcasts;
  const addPodcasts = () => {
    // return new Promise((resolve, reject) => {

    fetch(
      'https://yidpod.com/wp-json/wp/v2/podcasts?per_page=20&&categories=' +
        category.cat_ID,
      {
        headers: {
          'cache-control': 'no-cache',
          // Authorization: 'Bearer ' + props.accessToken,
        },
      },
    )
      .then(res => {
        return res.json();
      })
      .then(async newpodcasts => {
        // setAlbums(res);
        if (props.mounted) {
          // await category.addPodcasts(newpodcasts);
          dispatch(
            setPodcastsForCategory({
              category: category.cat_ID,
              podcasts: newpodcasts,
            }),
          );
          //   setAlbums(newpodcasts);
          // return newpodcasts;
          // resolve('done');
        }
      })
      .catch(error => {
        console.error(error);
      });
    // });
  };

  useEffect(() => {
    // addPodcasts();
  }, [props.category]);
  // const updateAlbumCount = () => {
  //   count.current++;

  //   if (albums && count.current == 2) {
  //     props.updateCount();
  //   }
  // };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CategoriesScreen', {
              id: category.term_id,
              name: category.name,
              type: category.type,
            });
          }}>
          <Text style={styles.title}>{category.name}</Text>
        </TouchableOpacity>
      </View>
      {category.podcasts ? (
        <FlatList
          data={category.podcasts}
          extraData={category.podcasts}
          removeClippedSubviews={true}
          renderItem={albumRender}
          initialNumToRender={3}
          keyExtractor={keyExtractor}
          ListEmptyComponent={useCallback(
            () => (
              <ActivityIndicator size={'large'} color={'grey'} />
            ),
            [],
          )}
          // ListFooterComponent={
          //   <SeeMore
          //     text={'View More Podcasts'}
          //     navParams={{ id: category.id, term: undefined }}
          //     screen={'CategoriesScreen'}
          //     navigation={navigation}
          //   />
          // }
          horizontal
        />
      ) : (
        <FlatList
          data={category.episodes}
          extraData={category.episodes}
          removeClippedSubviews={true}
          renderItem={episodeRender}
          initialNumToRender={3}
          keyExtractor={keyExtractor}
          ListEmptyComponent={useCallback(
            () => (
              <ActivityIndicator size={'large'} color={'grey'} />
            ),
            [],
          )}
          ListFooterComponent={
            <SeeMore
              text={'View More Episodes'}
              navParams={{
                id: category.term_id,
                term: undefined,
                name: category.name,
                terms: undefined,
              }}
              screen={'MoreEpisodesScreen'}
              navigation={navigation}
            />
          }
          horizontal
        />
      )}
    </View>
  );
};
// const enhance = withObservables(['podcasts', 'category'], ({ category }) => ({
//   category,
//   // podcasts: category.podcasts,
// }));
function areEqual(prevProps, nextProps) {
  return prevProps.id === nextProps.id;
}
export default AlbumCategory;
