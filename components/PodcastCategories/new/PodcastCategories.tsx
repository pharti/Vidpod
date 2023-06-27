import useSWRNative from '@nandorojo/swr-react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { PodcastCategory } from './PodcastCategory';
const fetcher = url => fetch(url).then(res => res.json());
const item = ({ item, index }) => (
  <PodcastCategory name={item.name} index={index} id={item.id} />
);
const keyExtractor = item => item.id.toString();

const PodcastCategories = () => {
  const { data, error } = useSWRNative(
    'https://yidpod.com/wp-json/wp/v2/categories?hideempty&exclude=81,97,1&orderby=count&per_page=50',
    fetcher,
  );
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
        data={data}
        extraData={data}
        renderItem={item}
        keyExtractor={keyExtractor}
        numColumns={2}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      />
    </View>
  );
};

export default PodcastCategories;
