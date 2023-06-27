import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import AlbumComponent from '../Album';

import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SpecialEpisode } from '../SpecialCategories/SpecialCategory/SpecialEpisode/newindex';
import styles from './styles';

export type AlbumCategoryProps = {
  id: number;
  title: string;
  accessToken: string;
  updateCount: any;
};
const keyExtractor = item => item.id.toString();

const AlbumCategory = props => {ø
  const { category, podcasts: albums, episodes } = props;

  // const realm = useRealm();
  const albumRender = useCallback(({ item }) => {
    // <View>
    //   <Text style={{ color: 'white' }}>{item.title}</Text>
    // </View>
    return (
      <AlbumComponent
        album={item}
        updateAlbumCount={updateAlbumCount}
        didunmount={props.unmounted}
      />
    );
    // return (
    //   <TouchableOpacity onPress={() => }>
    //     <Text style={{ color: 'white' }}>{item.title}</Text>
    //   </TouchableOpacity>
    // );
  }, []);
  const episodeRender = useCallback(
    ({ item }) => <SpecialEpisode item={item} />,
    [],
  );
  const navigation = useNavigation();
  const count = useRef(0);
  // const albums = realm.objectForPrimaryKey('Category', id).podcasts;
  const addPodcasts = () => {
    // return new Promise((resolve, reject) => {
    fetch(
      'https://yidpod.com/wp-json/wp/v2/podcasts?per_page=20&&categories=' +
        category.id,
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
          await category.addPodcasts(newpodcasts);
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
              id: category.id,
              name: category.title,
            });
          }}>
          <Text style={styles.title}>{category.title}</Text>
        </TouchableOpacity>
      </View>
      {category.podcasts ? (
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
          data={albums.sort((a, b) =>
            a.publishedDate > b.publishedDate ? -1 : 1,
          )}
          extraData={albums.sort((a, b) =>
            a.publishedDate > b.publishedDate ? -1 : 1,
          )}
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
      )}
    </View>
  );
};
const enhance = withObservables(['podcasts', 'category'], ({ category }) => ({
  category,
  podcasts: category.podcasts,
}));
export default React.memo(enhance(AlbumCategory));
