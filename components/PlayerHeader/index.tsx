import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import {episode} from '../../types'
import { useNavigation } from '@react-navigation/core';
import { useDispatch } from 'react-redux';
import { setShow } from '../../features/currentSongSlice';
import { convertDurationtoMs, convertMstoDuration } from '../../js/time';
import { PlayerSlider } from './PlayerSlider';
import styles from './styles';

export type PlayerHeaderProps = {
  title: string;
  duration: any;
  author: string | undefined;
  imageUri: string | undefined;
  episode_id: string;
  podcast_title: string;
  podcast_id: number;
  width: number;
  episode: any;
};

const PlayerHeader = props => {
  const { episode, podcast } = props;
  const { imageUri, title } = episode;
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const duration =
    episode.duration.indexOf(':') > -1
      ? episode.duration
      : convertMstoDuration(episode.duration);
  const maxValue =
    duration.indexOf(':') > -1 ? convertDurationtoMs(duration) : duration;
  const durationtext = duration.replace(/^0(?:0:0?)?/, '');
  // const leftValue = moment('2000-01-01 00:00:00').add(moment.duration(episode.position,'milliseconds')).format('m:ss');
  // const onSlide = (position:Number) =>{
  //     dispatch(setPosition(position));
  //     dispatch(setUpdated("position"));
  // }
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri:
              !error && imageUri
                ? imageUri.replace('-150x150', '')
                : podcast.imageUri
                ? podcast.imageUri.replace('-150x150', '')
                : '',
          }}
          style={styles.image}
          onError={e => {
            setError(e.nativeEvent.error);
          }}
          height={300}
          width={300}
          // resizeMethod={'resize'}
          resizeMode={'contain'}
          borderRadius={10}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(setShow(true));
            navigation.navigate('AlbumScreen', {
              id: podcast.id,
              name: podcast.title,
              title: podcast.title,
              type: podcast.type,
              audiobook: podcast.type && podcast.type.indexOf('audiobook') > -1,
              feedlink: podcast.feedlink,
              imageUri:
                'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
                podcast.id,
              author: podcast.author,
              // feedlink: props.album.feedlink,
              // image_uri: props.album.image_uri,
            });
          }}>
          <Text style={styles.author}>{podcast.title}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          marginTop: 10,
        }}>
        <PlayerSlider
          sliderStyle={styles.slider}
          maxValue={maxValue}
          durationtext={durationtext}
          episodePosition={episode.position}
          episode_id={episode.id}
          // duration={maxValue}
        />
      </View>
    </View>
  );
};
export default PlayerHeader;
