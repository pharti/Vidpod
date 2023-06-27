import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Text, Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useDispatch } from 'react-redux';
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
  if (!episode) {
    return null;
  }
  return (
    <View style={styles.container}>
      {!error ? (
        <Image
          source={{
            uri:
              !error && episode.imageUri
                ? episode.imageUri.replace('-150x150', '')
                : podcast.imageUri,
          }}
          style={styles.image}
          onError={e => {
            setError(e.nativeEvent.error);
          }}
        />
      ) : (
        <View style={[styles.image, { backgroundColor: 'grey' }]} />
      )}
      <Text style={styles.name}>{episode.title}</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.push('AlbumScreen', {
            id: podcast.id,
            name: podcast.title,
            type: podcast.type,
            audiobook: podcast.type && podcast.type.indexOf('audiobook') > -1,
          });
        }}>
        <Text style={styles.podcast_title}>{podcast.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EpisodeHeader;
