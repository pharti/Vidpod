import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import moment from 'moment';
import { Image, Text, View } from 'react-native';
import { convertDurationtoMs, convertMstoTime } from '../../../js/time';
import styles from '../styles';
import FastImage from 'react-native-fast-image';
type SearchItemProps = {
  title: string;
  image_uri: string | undefined;
  author: string | undefined;
  id: string;

  //   type: 'Podcast' | 'Episode';
};
export const EpisodeItem = props => {
  const navigation = useNavigation();
  //   const database = useDatabase();
  const duration =
    props.duration && props.duration != 'notfound'
      ? props.duration.indexOf(':') > -1
        ? convertMstoTime(convertDurationtoMs(props.duration))
        : convertMstoTime(props.duration)
      : '';

  const published = moment.unix(props.published_date).format('LL');
  return (
    <TouchableOpacity
      onPress={async () => {
        navigation.navigate('EpisodeScreen', {
          id: props.id,
          podcast_id: props.podcast_id,
          title: props.title,
          name: props.title,
          feedlink: '',
          // album: album,
        });
      }}>
      <View style={styles.container}>
        <FastImage
          source={{ uri: props.image_uri }}
          resizeMode={FastImage.resizeMode.contain}
          style={{ width: 50, height: 50 }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {props.title}
          </Text>
          <Text style={styles.author}>
            Episode {duration ? ' · ' + duration : ''} · {published}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
