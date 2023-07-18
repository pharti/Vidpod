import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import AlbumComponent from '../../components/Album/newindex';

const Item = ({ item }) => <AlbumComponent album={item} />;

const getCategories = (id) => {
  return fetch('https://yidpod.com/wp-json/wp/v2/podcasts?categories=' + id)
    .then(res => {
      return res.json();
    })
    .then(res => res)
    .catch(error => error);
};

const keyExtractor = item => item.id.toString();

const CategoriesScreen = () => {
  const [podcasts, setPodcasts] = useState([]);
  const route = useRoute();

  useEffect(() => {

    const setPodcastCategories = async () => {
      const newPodCasts = await getCategories(
        route?.params?.id,
      );
      setPodcasts(newPodCasts);
    };
    setPodcastCategories();

  }, []);

  return (
    <FlatList
      data={podcasts}
      //Not needed
      // extraData={podcasts}
      contentContainerStyle={{ alignItems: 'center', marginTop: 16 }}
      renderItem={Item}
      keyExtractor={keyExtractor}
      numColumns={2}
    />
  );
};
// const enhance = withObservables(['podcasts'], ({ database, route }) => ({
//   podcasts: fromFetch(
//     'https://yidpod.com/wp-json/wp/podcasts?categories[]=' + route.params.id,
//   ).pipe(
//     switchMap(response => {
//       if (response.ok) {
//         // OK return data
//         return response.json();
//       } else {
//         // Server is returning a status requiring the client to try something else.
//         return of({ error: true, message: `Error ${response.status}` });
//       }
//     }),
//     catchError(err => {
//       // Network or other error, handle appropriately
//       console.error(err);
//       return of({ error: true, message: err.message });
//     }),
//   ),
// }));
export default withDatabase(CategoriesScreen);

function fromFetch(arg0: string): any {
  throw new Error('Function not implemented.');
}
