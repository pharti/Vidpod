import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList } from 'react-native';
import EmptyList from '../EmptyList';
import SongListItem from '../SongListItem/forfeed';
const keyExtractor = item => item.id.toString();

const ListeningHistory = props => {
  const navigation = useNavigation();
  const flatListRef = useRef();
  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener('tabPress', e => {
      // Prevent default action
      // e.preventDefault();
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);
  return (
    <FlatList
      data={
        props.type == 'all'
          ? props.listeningHistory
          : props.downloadedListeningHistory
      }
      extraData={
        props.type == 'all'
          ? props.listeningHistory
          : props.downloadedListeningHistory
      }
      renderItem={({ item, index }) => {
        return (
          <SongListItem
            item={item}
            index={index}
            isOpaque={false}
            // iscurrentSong={currentSong.episode_id == item.id}
            // isplaying={currentSong.isplaying}
            podcast_title=""
            playSong={props.onPressSong}
          />
        );
      }}
      ref={flatListRef}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        <EmptyList
          messageString={
            props.type == 'downloaded' || props.type == 'new'
              ? 'There are no downloaded episodes that you have listened to'
              : 'The latest episodes you have listened to will appear her.'
          }
        />
      }
    />
  );
};

const enhance = withObservables(
  ['database', 'latestEpisodes'],
  ({ database }) => ({
    listeningHistory: database
      .get('episodes')
      .query(
        Q.where('title', Q.notEq('')),
        Q.where('playDate', Q.notEq(0)),
        Q.sortBy('playDate', Q.desc),
      ),
    downloadedListeningHistory: database
      .get('episodes')
      .query(
        Q.where('title', Q.notEq('')),
        Q.where('playDate', Q.notEq(0)),
        Q.where('cachedUrl', Q.notEq('')),
        Q.sortBy('playDate', Q.desc),
      ),
  }),
);
export default withDatabase(enhance(ListeningHistory));
