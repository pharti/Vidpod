import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from '../../../Album/styles';

export const SpecialEpisode = ({ item }) => {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const database = useDatabase();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('EpisodeScreen', {
          id: item.id,
          podcast_id: item.podcast ? item.podcast.id : item.podcast_id,
          title: item.title,
          name: item.title,
          feedlink: '',
          //   podcast: podcast ? podcast : null,

          // album: album,
        });
      }}>
      <View style={styles.container}>
        <FastImage
          source={{
            uri:
              !error && item.image_uri
                ? item.image_uri
                : 'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
                  (item.podcast ? item.podcast.id : item.podcast_id),
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.image}
          onError={e => {
            setError(e.nativeEvent.error);
          }}
        />

        <Text style={styles.text} numberOfLines={2}>
          {item.title ? item.title.slice(0, 60) : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
