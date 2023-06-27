import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AlbumComponent from '../Album';
import { SpecialEpisode } from '../SpecialCategories/SpecialCategory/SpecialEpisode/forepisode';
const albumRender = ({ item, index }) => {
  // <View>
  //   <Text style={{ color: 'white' }}>{item.title}</Text>
  // </View>
  return <AlbumComponent album={item} key={index} />;
  // return (
  //   <TouchableOpacity onPress={() => console.log('hello there')}>
  //     <Text style={{ color: 'white' }}>{item.title}</Text>
  //   </TouchableOpacity>
  // );
};
const episodeRender = ({ item, index }) => {
  return <SpecialEpisode item={item} />;
};

const keyExtractor = (item, index) => index + '';

const PlayedShows = (props: any) => {
  const [refresh, setRefresh] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setRefresh(!refresh);
    }, []),
  );
  if (props.playedShows.length > 1) {
    return (
      <View style={{ margin: 10 }}>
        <View>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            Recently Played
          </Text>
        </View>
        <FlatList
          data={
            props.type == 'podcast' ? props.playedShows : props.playedEpisodes
          }
          extraData={
            props.type == 'podcast' ? props.playedShows : props.playedEpisodes
          }
          renderItem={props.type == 'podcast' ? albumRender : episodeRender}
          keyExtractor={keyExtractor}
          horizontal
        />
      </View>
    );
  } else {
    return null;
  }
};
const enhance = withObservables(['categories'], ({ database }) => ({
  // categories: database
  // .get('categories')
  // .query(Q.where('index', Q.gt(-1)), Q.sortBy('index')), // shortcut syntax for `comment: comment.observe()`
  playedShows: database
    .get('podcasts')
    .query(Q.where('play_date', Q.gt(0)), Q.sortBy('play_date', Q.desc)),
  playedEpisodes: database
    .get('episodes')
    .query(Q.where('playDate', Q.gt(0)), Q.sortBy('playDate', Q.desc)),
}));

export default withDatabase(enhance(PlayedShows));
