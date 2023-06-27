import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import styles from '../styles';
type SearchItemProps = {
  title: string;
  image_uri: string | undefined;
  author: string | undefined;
  id: string;

  //   type: 'Podcast' | 'Episode';
};
export const PodcastItem = props => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={async () => {
        // await database.write((writer) => {
        //   return database
        //     .get('podcasts')
        //     .find(props.id)
        //     .then((p) => {
        //       writer.callWriter(() =>
        //         p.update((e) => {
        //           e.type = props.tags;
        //           e.title = props.title;
        //         }),
        //       );
        //     })
        //     .catch((error) => console.log(error));
        // });
        if (
          !props.tags ||
          !(props.tags.indexOf('locked') > -1 && !props.unlock)
        ) {
          navigation.navigate('AlbumScreen', {
            id: props.id,
            title: props.title,
            name: props.title,
            feedlink: '',
            type: props.tags,
            author: props.author,
            imageUri: props.image_uri,
            email: props.email,
            audiobook: props.tags && props.tags.indexOf('audiobook') > -1,
            // album: album,
          });
        }
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
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.author}>Podcast · {props.author}</Text>
            {props.tags &&
            props.tags.indexOf('locked') > -1 &&
            !props.unlock ? (
              <Icon
                name={'lock'}
                size={20}
                color={'white'}
                style={{
                  borderBottomRightRadius: 10,
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
