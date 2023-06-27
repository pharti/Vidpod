import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Image, Text, View } from 'react-native';
import styles from './styles';
type SearchItemProps = {
  title: string;
  image_uri: string | undefined;
  author: string | undefined;
  id: string;

  //   type: 'Podcast' | 'Episode';
};
export const SearchItem = props => {
  const navigation = useNavigation();
  const database = useDatabase();
  return (
    <TouchableOpacity
      onPress={async () => {
        const album = await database.write(async () => {
          const findalbum = await database.get('podcasts').find(props.id + '');
          if (!findalbum) {
            return await database.get('podcasts').create(podcast => {
              podcast.author = props.author;
              podcast.imageUri = props.image_uri;
              podcast.description = props.description;
              podcast.title = props.title;
              podcast._raw.id = props.id + '';
              // podcast.subscribed = 0;

              // podcast.subscribed = newpodcast.subscribed;
              podcast.type = props.tags;
              podcast.likes = props.likes;
            });
          } else {
            return findalbum;
          }
        });

        navigation.navigate('AlbumScreen', {
          id: album.id,
          title: album.title,
          name: album.title,
          feedlink: '',
          type: album.type,
          audiobook: album.type && album.type.indexOf('audiobook') > -1,

          // album: album,
        });
      }}>
      <View style={styles.container}>
        {props.image_uri ? (
          <Image
            source={{ uri: props.image_uri }}
            style={{ width: 50, height: 50 }}
          />
        ) : null}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {props.title}
          </Text>
          <Text style={styles.author}>{props.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
