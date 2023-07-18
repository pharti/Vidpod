import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import FastImage from 'react-native-fast-image';
import { Episode } from '../../features/episodesSlice';
// import {episode} from '../../types'
import styles from './styles';

export type EpisodeHeaderProps = {
  episode: Episode | undefined;
};

const EpisodeHeader = props => {
  const { episode, podcast } = props;
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  if (!episode || !podcast) {
    return null;
  }
  return (
    <View style={styles.container}>
      {!error ? (
        <FastImage
          source={{
            uri:
              !error && episode.image_uri
                ? episode.image_uri.replace('-150x150', '')
                : podcast.image_uri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.image}
          onError={e => {
            setError(e.nativeEvent.error);
          }}
        />
      ) : (
        <View style={[styles.image, { backgroundColor: 'grey' }]} />
      )}
      <Text style={styles.name}>
        {episode.title.rendered ? episode.title.rendered : episode.title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.push('AlbumScreen', {
            id: podcast.id,
            name: podcast.title,
            type: podcast.type,
            audiobook: podcast.type && podcast.type.indexOf('audiobook') > -1,
            title: podcast.title,
            feedlink: podcast.feedlink,
            imageUri:
              'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
              podcast.id,
            author: podcast.author,
            email: podcast.email,
          });
        }}>
        <Text style={styles.podcast_title}>
          {podcast.title.rendered
            ? podcast.title.rendered
            : podcast.title
              ? podcast.title
              : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EpisodeHeader;
