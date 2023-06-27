import React from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AlbumComponent from '../components/Album';
import EmptyList from '../components/EmptyList';

import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { StyleSheet } from 'react-native';
const Item = ({ item }) => <AlbumComponent album={item} />;
const keyExtractor = item => item.id.toString();

const LibraryScreen = ({ podcasts }) => {
  const dispatch = useDispatch();
  // const podcasts = useSelector((state) => selectAllPodcasts(state)).filter(
  //   (e) => e.subscribed,
  // );

  return (
    <View style={styles.container}>
      <FlatList
        data={podcasts}
        //Not needed
        // extraData={podcasts}
        renderItem={Item}
        keyExtractor={keyExtractor}
        numColumns={2}
        ListEmptyComponent={
          <EmptyList
            messageString={'Podcasts you subscribe to will appear here.'}
          />
        }
      />
    </View>
  );
};
const enhance = withObservables(['podcasts'], ({ database }) => ({
  podcasts: database.get('podcasts').query(Q.where('subscribed', Q.gt(0))),
}));
export default withDatabase(enhance(LibraryScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
});
