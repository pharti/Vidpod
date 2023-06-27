import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { catchError } from 'rxjs/operators';
import AlbumEpisodes from '../components/AlbumEpisodes';
// import realm from '../database/realm/database.js';

const AlbumScreen = ({ episodes, podcast, navigation }) => {
  const route: RouteProp<
    {
      params: {
        feedlink: string;
        id: number;
        title: string;
        image_uri: string;
        album: any;
      };
    },
    'params'
  > = useRoute();
  // const realm = useRealm();
  const mounted = useRef(true);
  const momentum = useRef(false);
  const f = useRef(false);

  // const  episodesFiltered= createSelector([selectAllEpisodes],(episodes)=>episodes
  // const [episodes, setEpisodes] = useState(
  //   realm.objectForPrimaryKey('Podcast', route.params?.id).episodes,
  // );

  // const filterEpisodes = episodes
  //   .filter((e) => e && e.podcast_id == route.params.id)
  //   .sort();
  // const podcast = realm.objectForPrimaryKey('Podcast', route.params?.id);
  const [fetching, setFetching] = useState<boolean>(true);
  const [dontfetch, setDontfetch] = useState<boolean>(false); //
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [term, setTerm] = useState('');
  useEffect(() => {
    navigation.setParams({ name: podcast.title });
  }, [podcast.title]);

  return (
    <View style={styles.container}>
      <AlbumEpisodes podcast={podcast} termChanged={setTerm} term={term} />
    </View>
  );
};
const enhance = withObservables(
  ['podcast'],
  ({ podcast, database, route, navigation }) => {
    // const route = useRoute();
    // const id = route.params?.id;

    return {
      podcast: database
        .get('podcasts')
        .findAndObserve(route.params.id)
        .pipe(
          catchError(async err => {
            const url =
              'https://yidpod.com/wp-json/wp/v2/podcasts?include[]=' +
              route.params.id;
            const e = await fetch(url, {
              headers: {
                'cache-control':
                  'public, max-age=100,stale-while-revalidate=86400',
              },
            })
              .then(res => res.json())
              .then(async newpodcast => {
                if (newpodcast.length) {
                  const p = newpodcast[0];
                  const album = await database.write(async () => {
                    return await database.get('podcasts').create(podcast => {
                      podcast.author = p.author;
                      podcast.imageUri = p.image_uri;
                      podcast.description = p.description;
                      podcast.title = p.title.rendered
                        ? p.title.rendered
                        : p.title;
                      podcast._raw.id = p.id + '';
                      podcast.type = p.tags;
                      podcast.likes = p.likes;
                    });
                  });

                  return album;
                }
              });
            navigation.setParams({
              name: e.title.rendered ? e.title.rendered : e.title,
              title: e.title.rendered ? e.title.rendered : e.title,
            });
            return e;
          }),
        ),
    };
  },
);

export default withDatabase(enhance(AlbumScreen));
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1E22',
    flex: 1,
  },
  list: { paddingBottom: 5 },
});
