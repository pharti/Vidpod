import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import AlbumComponent from '../../components/Album/newindex';
// import EmptyList from '../components/EmptyList';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
const Item = ({ item }) => <AlbumComponent album={item} />;
const getCategories = (index, id, slug) => {
  return fetch('https://yidpod.com/wp-json/wp/v2/podcasts?' + slug + '=' + id)
    .then(res => {
      return res.json();
    })
    .then(res => res)
    .catch(error => error);
};
const keyExtractor = item => item.id.toString();

const CategoriesScreen = props => {

  const [podcasts, setPodcasts] = useState([]);
  // const dispatch = useDispatch();
  const route = useRoute();
  // const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //   (e) => e.subscribed,
  // );
  useEffect(() => {
    const first = async () => {
      const newpodcasts = await getCategories(
        0,
        route.params.id,
        route.params.slug,
      );
      setPodcasts(newpodcasts);
    };
    first();
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
