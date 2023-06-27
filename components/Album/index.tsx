import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export type AlbumProps = {
  album: any;
};
export type Feed = {
  authors: [];
  categories: [];
  copyright: string;
  description: string;
  image: { url: string };
  items: [];
  itunes: object;
  language: string;
  lastPublished: string;
  lastUpdated: string;
  links: [];
  title: string;
  type: string;
};

const AlbumComponent = (props: AlbumProps) => {
  // const [feed, setFeed] = useState<rssParser.Feed>();
  // const [loading, setLoading] = useState<Boolean>(true);
  // const podcast = useSelector((state) => selectById(state, props.album.id));
  const title = props.album.title.rendered
    ? props.album.title.rendered
    : props.album.title;
  const onPress = () => {
    navigation.navigate('AlbumScreen', {
      id: props.album.id,
      name: title,
      title: title,
      feedlink: props.album.feedlink,
      imageUri: props.album.imageUri,
      type: props.album.type,
      subscribed: props.album.subscribed,
      author: props.album.author,
      audiobook: props.album.type && props.album.type.indexOf('audiobook') > -1,
    });
  };
  const navigation = useNavigation();
  // useEffect(() => {
  //   //Only fetch feed if podcast doesn't exist or if it was last updated an hour ago.
  //   if (
  //     (props.album.feedlink && !podcast) ||
  //     (podcast && new Date().getTime() - podcast.updated_at > 0)
  //   ) {
  //     if (props.album.title) {
  //       const newpodcast: Podcast = {
  //         id: props.album.id,
  //         image_uri: props.album.image_uri,
  //         type: props.album.type,
  //         author: props.album.author ? props.album.author : '',
  //         subscribed: podcast ? podcast.subscribed : 0,
  //         likes: 0,
  //         feedlink: props.album.feedlink,
  //         title: props.album.title,
  //         artistsHeadline: props.album.artistsHeadline,
  //         updated_at: new Date().getTime(),
  //         episodesCount: props.album.episodesCount,
  //       };
  //       dispatch(upsertPodcast(newpodcast));
  //     }
  //   }
  // }, [props.album.feedlink]);
  return (
    <View>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          {props.album && props.album.imageUri ? (
            <Image
              source={{ uri: props.album.imageUri }}
              style={styles.image}
              // resizeMethod="resize"
              onLoadEnd={() => {
                if (props.updateAlbumCount) {
                  props.updateAlbumCount();
                }
              }}
              // resizeMode="cover"
            />
          ) : (
            <View style={styles.noimage}></View>
          )}
          <Text style={styles.text} numberOfLines={2}>
            {title ? title.slice(0, 60) : ''}
          </Text>
          {/* <Text style={styles.author} numberOfLines={1}>
            {props.album.author ? props.album.author.slice(0, 60) : ''}
          </Text> */}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AlbumComponent;
