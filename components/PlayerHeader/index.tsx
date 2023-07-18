import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  const { episode, podcast, showOptions, imageDimensions, showOptionsIcon = false, showSlider = false } = props;
  const { imageUri, title } = episode;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [error, setError] = useState(null);

  const duration =
    episode.duration.indexOf(':') > -1
      ? episode.duration
      : convertMstoDuration(episode.duration);
  const maxValue =
    duration.indexOf(':') > -1 ? convertDurationtoMs(duration) : duration;
  const durationText = duration.replace(/^0(?:0:0?)?/, '');

  // const leftValue = moment('2000-01-01 00:00:00').add(moment.duration(episode.position,'milliseconds')).format('m:ss');
  // const onSlide = (position:Number) =>{
  //     dispatch(setPosition(position));
  //     dispatch(setUpdated("position"));
  // }

  const onPressPodcastTitle = () => {
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
  };

  return (
    <View style={styles.container} >
      <View
        style={{
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
          style={[styles.image, imageDimensions]}
          onError={e => {
            setError(e.nativeEvent.error);
          }}
          resizeMode={'contain'}
          borderRadius={10}
        />
      </View>
      <View style={styles.podcastDetails}>
        <View style={{ flex: 0.9 }}>
          <Text style={styles.name} numberOfLines={2}>{title}</Text>
          <TouchableOpacity
            onPress={() => onPressPodcastTitle()}>
            <Text style={styles.author} numberOfLines={2}>{podcast.title}</Text>
          </TouchableOpacity>
        </View>
        {showOptionsIcon &&
          <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", }}
            onPress={() => showOptions()}>
            <Icon
              name={'more-vert'}
              size={30}
              color={episode.eIndex > 0 ? 'white' : 'grey'}
            />
          </TouchableOpacity>
        }
      </View>
      {showSlider &&
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 16
          }}>
          <PlayerSlider
            sliderStyle={styles.slider}
            maxValue={maxValue}
            durationText={durationText}
            episodePosition={episode.position}
            episode_id={episode.id}
          />
        </View>
      }
    </View>
  );
};

export default PlayerHeader;
