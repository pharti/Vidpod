import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { PodcastCategory } from './PodcastCategory';
const keyExtractor = item => item.id.toString();

const PodcastCategories = ({ categories }) => {
  return (
    <View>
      <View
        style={{
          paddingTop: 5,
          marginLeft: 10,
          marginBottom: 5,
        }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          Podcast Categories
        </Text>
      </View>
      <FlatList
        data={categories}
        extraData={categories}
        renderItem={useCallback(
          ({ item, index }) => (
            <PodcastCategory title={item.title} index={index} id={item.id} />
          ),
          [],
        )}
        keyExtractor={keyExtractor}
        numColumns={2}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      />
    </View>
  );
};
const enhance = withObservables(['categories'], ({ database }) => ({
  categories: database.get('categories').query(), // shortcut syntax for `comment: comment.observe()`
}));
export default withDatabase(enhance(PodcastCategories));
