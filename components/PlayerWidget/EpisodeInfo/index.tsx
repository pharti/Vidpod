import { Image, Text, View, TouchableOpacity } from 'react-native';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useState } from 'react';
import TextTicker from 'react-native-text-ticker';
import { catchError } from 'rxjs/operators';
import { createEpisode, createPodcast } from '../../../database/functions';
import styles from '../styles';
const EpisodeInfo = props => {
  const { episode, podcast } = props;
  const [error, setError] = useState(false);
  if (!episode || !episode.id) {
    return null;
  }
  return (
    <>
      <View>
        <TouchableOpacity onPress={props.show}>
          {episode.imageUri || podcast.imageUri ? (
            <Image
              source={{
                uri:
                  !error && episode.imageUri
                    ? episode.imageUri
                    : podcast.imageUri,
              }}
              style={styles.image}
              onError={e => {
                setError(e.nativeEvent.error);
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, { backgroundColor: 'grey' }]} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={props.show}>
          <TextTicker style={styles.title} scroll={false} loop duration={10000}>
            {/* <Text numberOfLines={1} style={styles.title}> */}
            {episode ? episode.title : ''}
            {/* </Text> */}
          </TextTicker>
          <Text
            style={{
              color: 'white',
              opacity: 0.5,
              fontWeight: '600',
              paddingTop: 3,
              fontSize: 14,
              textAlign: 'left',
            }}
            numberOfLines={1}>
            {podcast ? podcast.title : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const getPodcast = podcast_id => {
  return new Promise((resolve, reject) => {
    fetch('https:/yidpod.com/wp-json/yidpod/v2/podcasts?id=' + podcast_id)
      .then(res => res.json())
      .then(async podcast => {
        await createPodcast(podcast);
        resolve(podcast);
      });
  });
};
// const getEpisode = () => {
//   const url =
//     'https://yidpod.com/wp-json/yidpod/v1/episodes?id=' +
//     route.params?.id.replace('episodes_', '').replace('e', '');
//   fetch(url, { method: 'GET' })
//     .then(res => res.json())
//     .then(ep => {
//       setEpisode(ep[0]);
//     })
//     .catch(error => console.log(error));
// };
const enhance = withObservables(
  ['episode_id', 'podcast_id', 'database'],
  ({ episode_id, database, podcast_id }) => {
    return {
      episode: database
        .get('episodes')
        .findAndObserve('e' + episode_id.replace('e', ''))
        .pipe(
          catchError(err => {
            const url =
              'https://yidpod.com/wp-json/yidpod/v1/episodes?id=' +
              episode_id.replace('e', '');
            return fetch(url, {
              method: 'GET',
              headers: {
                'cache-control':
                  'public, max-age=100,stale-while-revalidate=86400',
              },
            })
              .then(res => res.json())
              .then(async ep => {
                await createEpisode(ep, null);
                return ep;
              })
              .catch(error => {
                return { position: 0 };
              });
          }),
        ),
      podcast: database
        .get('podcasts')
        .findAndObserve(podcast_id + '')
        .pipe(
          catchError(async err => {
            const p = await getPodcast(podcast_id);
            return p;
          }),
        ),
    };
  },
);
export default withDatabase(enhance(EpisodeInfo));
