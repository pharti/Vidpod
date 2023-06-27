import React from 'react';
import { View, FlatList } from 'react-native';

import { useDispatch } from 'react-redux';
import AlbumComponent from '../components/Album';
// import EmptyList from '../components/EmptyList';

import { StyleSheet } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { Q } from '@nozbe/watermelondb';
const Category = ({ item }) => <AlbumComponent album={item} />;
const keyExtractor = item => item.id.toString();

const CategoriesScreen = ({ podcasts }) => {
  // const dispatch = useDispatch();
  // const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //   (e) => e.subscribed,
  // );

  return (
    <View style={styles.container}>
      <FlatList
        data={podcasts}
        //Not needed
        // extraData={podcasts}
        renderItem={Category}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
    </View>
  );
};
const enhance = withObservables(['podcasts'], ({ database, route }) => ({
  podcasts: database
    .get('podcasts')
    .query(Q.on('category_podcasts', 'category_id', route.params.id)),
}));
export default withDatabase(enhance(CategoriesScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
});
