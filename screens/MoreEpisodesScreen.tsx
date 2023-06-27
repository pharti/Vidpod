import React, { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';

// import EmptyList from '../components/EmptyList';

import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SpecialEpisode } from '../components/SpecialCategories/SpecialCategory/SpecialEpisode/newindex';
const Item = ({ item }) => <SpecialEpisode item={item} />;
const keyExtractor = item => item.id.toString();
export const MoreEpisodesScreen = props => {
  const route = useRoute();
  const mounted = useRef(true);
  const fetching = useRef(false);
  const [episodes, setEpisodes] = useState([]);
  const getEpisodes = () => {
    const url =
      'https://yidpod.com/wp-json/yidpod/v2/episodes-by-category?category=' +
      route.params?.id;
    '&offset=' + (episodes ? episodes.length : 0);
    if (!fetching.current) {
      fetching.current = true;
      fetch(url, {
        headers: {
          'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
        },
      })
        .then(e => {
          return e.json();
        })
        .then(async theepisodes => {
          if (mounted.current) {
            setEpisodes([...episodes, ...theepisodes]);
            // dispatch(addTermEpisodes(term,theepisodes));
            // await database.write(async () => {
            //   const episodesCollection = database.get('episodes');
            //   const createEpisodes = theepisodes.map((episode) =>
            //     episodesCollection.prepareCreate((newepisode) => {
            //       newepisode.author = episode.author;
            //       newepisode.imageUri = episode.image_uri;
            //       newepisode.description = episode.description;
            //       newepisode.title = episode.title;
            //       newepisode.wId = parseInt(episode.id);
            //       newepisode._raw.id = 'e' + episode.id;
            //       newepisode.eIndex = parseInt(episode.e_index);
            //       newepisode.publishedDate = parseInt(episode.published_date);
            //       // podcast.subscribed = newpodcast.subscribed;
            //       newepisode.duration = episode.duration;
            //       newepisode.url = episode.url;
            //       newepisode.podcast.id = episode.podcast_id;
            //     }),
            //   );
            //   await database.batch(...createEpisodes);
            // });
            fetching.current = false;
          }
        });
    }
  };
  useEffect(() => {
    getEpisodes();
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={episodes}
        extraData={episodes}
        onEndReached={useCallback(() => {
          getEpisodes();
        }, [episodes.length])}
        onEndReachedThreshold={0.5}
        renderItem={Item}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
    </View>
  );
};
// const enhance = withObservables(
//   ['route', 'database'],
//   ({ database, route }) => {
//     const terms = route.params.terms;
//     const term = route.params.term;
//     const thequery = terms.map((t) =>
//       Q.where('title', Q.like('%' + Q.sanitizeLikeString(t.trim()) + '%')),
//     );
//     return {
//       episodes: database
//         .get('episodes')
//         .query(
//           Q.or(
//             ...thequery,
//             Q.where(
//               'title',
//               Q.like('%' + Q.sanitizeLikeString(term.trim()) + '%'),
//             ),
//           ),
//           Q.sortBy('published_date', Q.desc),
//         ),
//     };
//   },
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
});
