import {
  useFocusEffect,
  useIsFocused,
  useScrollToTop,
} from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../features/userSlice';
// import EditScreenInfo from '../components/EditScreenInfo';
import { useCallback, useRef, useState } from 'react';
import AlbumCategory from '../components/AlbumCategory/newindex';
import { View } from '../components/Themed';
// import { useRealm, useRealmObjectsQuery, withRealm } from 'react-realm-ctx';
import { Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import Ad from '../components/Ad';
import LatestEpisodes from '../components/LatestEpisodes';
import PlayedShows from '../components/PlayedShows';
import { SpecialCategories } from '../components/SpecialCategories';
import {
  ehomeSelector,
  homeSelector,
  setNewCategories,
  setNewEpisodes,
} from '../features/updateSlice';
import Top from '../components/Home/Top';
import NetInfo from "@react-native-community/netinfo";

// import { ScrollView } from 'react-native-gesture-handler';
type Category = {
  name: string;
  term_id: number;
};

const keyExtractor = (item, index) => index;

function TabOneScreen({ playedShows }) {
  const user = useSelector(userSelector);

  const albumCategory = useCallback(({ item, index }) => {
    return (
      <AlbumCategory
        // id={item.term_id}
        category={item}
        index={index}
      // title={item.title}
      // accessToken={''}
      />
    );
  }, []);

  // const [loading, setLoading] = useState<boolean>(false);
  const mounted = useRef(true);
  const [type, setType] = useState('Episodes');
  const homescreen = useSelector(homeSelector, shallowEqual);
  const e_homescreen = useSelector(ehomeSelector, shallowEqual);

  // const didUnmount = () => {
  //   mounted.current = false;
  // };
  // console.log(loading + ' has changeds');
  // console.log(playedShows);
  // console.log()
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // const categories = useRealmObjectsQuery('Category', {
  //   sorted: [['index', false]],
  // });

  // const categories = useRealmObjectsQuery('Category', {
  //   sorted: [['index', false]],
  // });

  // console.log(homescreen);
  // console.log(error);

  // const access_token = user ? user.access_token : '';
  // const getCategories = () => {
  //   setCategories();
  // };
  // const allpodcasts = useSelector(selectEntities);
  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      mounted.current = true;
      // setLoading(true);

      fetchData();

      // setLoading(false);
      // realm.write(() =>
      //   newcategories.forEach((category, index) => {
      //     realm.create(
      //       'Category',
      //       {
      //         term_id: category.term_id,
      //         title: category.name,
      //         index: index,
      //       },
      //       'modified',
      //     );
      //   }),
      // );

      return () => {
        mounted.current = false;

        // realm.close();
      };
    }, []),
  );

  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    // setCategories([]);
    setRefreshing(true);

    // setLoading(true);
    const id = user.wp_user ? user.wp_user.ID : -1;
    const url = 'https://yidpod.com/wp-json/yidpod/v2/homescreen/categories';
    console.log(url)
    fetch(url + (type == 'Episodes' ? '?type=e_' : '?type='), {
      cache: 'no-cache',
      // headers: { Authorization: 'Bearer ' + user.access_token },
    })
      .then(res => {
        console.log(res)
        return res.json();
      })

      .then(res => {
        if (mounted) {
          // setCategories(categories);
          // database.unsafeResetDatabase();
          // return;
          // database.batch(categories.map())
          setRefreshing(false);
          // setLoading(false);
          if (type == 'Shows') {
            dispatch(setNewCategories(res.categories));
          } else {
            dispatch(setNewEpisodes(res.categories));
          }
          // if (updates.homescreen) {
          // doNewCategoriesFetch(res, database);
          // } else {
          // doOldCategoriesFetch(res, database);
          // }
        }
      })
      .catch(error => {
        console.log(error);
        setRefreshing(false);
      });
  }, [type]);
  useEffect(() => {
    console.log('herre')
    mounted.current = true;
    // setLoading(true);

    fetchData();

    // setLoading(false);
    // realm.write(() =>
    //   newcategories.forEach((category, index) => {
    //     realm.create(
    //       'Category',
    //       {
    //         term_id: category.term_id,
    //         title: category.name,
    //         index: index,
    //       },
    //       'modified',
    //     );
    //   }),
    // );
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    return () => {
      mounted.current = false;

      // realm.close();
    };

  }, [type]);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  const addPodcasts = category => {
    return new Promise((resolve, reject) => {
      fetch(
        'https://yidpod.com/wp-json/wp/v2/podcasts?per_page=20&&categories=' +
        category.id,
        {
          headers: {
            'cache-control': 'no-cache',
            // Authorization: 'Bearer ' + props.accessToken,
          },
        },
      )
        .then(res => {
          return res.json();
        })
        .then(async newpodcasts => {
          // setAlbums(res);
          if (mounted.current) {
            const p = await category.addPodcasts(newpodcasts);
            // return newpodcasts;
            resolve('done');
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  };
  const emptyComponent = useCallback(
    () => <ActivityIndicator size={'large'} color={'grey'} />,
    [],
  );
  // useScrollToTop(ref);
  // const marginBottom = useSafeAreaInsets().bottom;
  // const currentSong = useSelector(currentSongSelector);
  // console.log(updates.homescreen);
  const getListHeader = r => {
    return (
      <>
        <PlayedShows
          refreshing={r}
          type={type == 'Episodes' ? 'episodes' : 'podcast'}
        />
        {type == 'Episodes' ? <LatestEpisodes refreshing={r} /> : null}

        <Ad refreshing={r} />
        {type == 'Episodes' ? <SpecialCategories refreshing={r} /> : null}
      </>
    );
  };

  return (
    <View style={{ paddingBottom: 50 }}>
      <Top type={type} setType={setType} />

      <FlatList
        ref={ref}
        data={type == 'Shows' ? homescreen : e_homescreen}
        extraData={type == 'Shows' ? homescreen : e_homescreen}
        renderItem={albumCategory}
        refreshing={refreshing}
        // removeClippedSubviews={true}
        // style={styles.list}
        initialNumToRender={3}
        onRefresh={fetchData}
        // onViewableItemsChanged={useCallback(async (props) => {
        //   console.log(props);
        // }, [])}
        ListHeaderComponent={getListHeader(refreshing)}
        ListEmptyComponent={emptyComponent()}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

// const enhance = withObservables(['categories'], ({ database }) => ({
//   // categories: database
//   // .get('categories')
//   // .query(Q.where('index', Q.gt(-1)), Q.sortBy('index')), // shortcut syntax for `comment: comment.observe()`
//   playedShows: database
//     .get('podcasts')
//     .query(Q.where('play_date', Q.gt(0)), Q.sortBy('play_date', Q.desc)),
// }));
const doOldCategoriesFetch = async (res, database) => {
  const newcategories = res.categories
    .filter(item => item)
    .map((category, index) => ({ ...category, index }));
  const newpodcasts = res.podcasts;
  const newcpodcasts = res.category_podcasts;
  // const categoryIds = newcategories.map((n) => n.term_id + '');
  const categoryCollection = database.get('categories');

  const categoriesToUpdate = await categoryCollection.query().fetch();
  const doneCategoryIds = categoriesToUpdate.map(category => category.id);

  const categoriesToCreate = newcategories.filter(
    category => doneCategoryIds.indexOf(category.term_id + '') == -1,
  );
  const categoriesMap = newcategories.reduce(
    (acc, cur) => ({ ...acc, [cur.term_id]: cur }),
    {},
  );

  const podcastsCollection = database.get('podcasts');

  const podcast_ids = newpodcasts.reduce(
    (acc, cur) => ({ ...acc, [cur.ID]: cur }),
    {},
  );
  const term_ids = Object.keys(podcast_ids);

  const existingPosts = await podcastsCollection
    .query(Q.where('id', Q.oneOf(term_ids)))
    .fetch();
  const existingTermIds = existingPosts.map(c => c.id);
  const podcastsToCreate = newpodcasts.filter(
    c => existingTermIds.indexOf(c.ID + '') == -1,
  );
  const podcastsToDelete = existingPosts.filter(
    c => term_ids.indexOf(c.id + '') == -1,
  );
  const podcastsToUpdate = existingPosts.filter(
    c => term_ids.indexOf(c.id + '') > -1,
  );

  const cp = database.get('category_podcasts');
  const qs = [];

  for (const podcast_id in newcpodcasts) {
    const newcpodcast = newcpodcasts[podcast_id];
    for (const category_id of newcpodcast) {
      qs.push({
        category_id,
        podcast_id,
        id: category_id + '-' + podcast_id,
      });
    }
  }
  const qsmap = qs.map(i => i.id);
  const there = await cp.query(Q.where('id', Q.oneOf(qsmap))).fetch();
  const there_ids = there.map(t => t.id);
  const notthere = qs.filter(t => there_ids.indexOf(t.id) == -1);

  await database.write(async () => {
    const notoneof = await cp
      .query(Q.where('id', Q.notIn(qsmap)))
      .destroyAllPermanently();
    const ctoupdate = categoriesToUpdate.map(oldcategory =>
      oldcategory.prepareUpdate(category => {
        const found = categoriesMap[category.id];
        if (found) {
          category.index = found.index;
          category.title = found.name;
        } else {
          category.index = -1;
        }
      }),
    );
    const ctocreate = categoriesToCreate.map(newcategory =>
      categoryCollection.prepareCreate(category => {
        category._raw.id = newcategory.term_id + '';
        category.index = newcategory.index;
        category.title = newcategory.name;
      }),
    );
    const updatedPodcasts = podcastsToUpdate.map(oldpodcast =>
      oldpodcast.prepareUpdate(podcast => {
        podcast.title = podcast_ids[oldpodcast.id].post_title;
        podcast.imageUri = podcast_ids[oldpodcast.id].image_uri;
        podcast.author = podcast_ids[oldpodcast.id].author;
        podcast.publishedDate = podcast_ids[oldpodcast.id].publishedDate;
        podcast.notify = podcast_ids[oldpodcast.id].notify
          ? podcast_ids[oldpodcast.id].notify
          : oldpodcast.notify;
        podcast.subscribed = podcast_ids[oldpodcast.id].subscribed
          ? podcast_ids[oldpodcast.id].subscribed
          : oldpodcast.subscribed;
      }),
    );
    const createdPodcasts = podcastsToCreate.map(newpodcast => {
      // const subscribed = allpodcasts[newpodcast.ID + '']
      //   ? allpodcasts[newpodcast.ID + '']?.subscribed
      //   : 0;

      return podcastsCollection.prepareCreate(podcast => {
        podcast.author = newpodcast.author;
        podcast.imageUri = newpodcast.image_uri;
        podcast.description = newpodcast.post_content;
        podcast.title = newpodcast.post_title;
        podcast._raw.id = newpodcast.ID + '';
        podcast.publishedDate = newpodcast.publishedDate;
        podcast.subscribed = newpodcast.subscribed;
        podcast.notify = newpodcast.notify;
        podcast.type = newpodcast.tags;
        podcast.likes = 0;
        // podcast.category.set(this);
      });
    });

    // const self = this;
    // if podcast exists but not in this category add it.
    const cptocreate = notthere.map(item =>
      cp.prepareCreate(cpitem => {
        cpitem.categoryId = item.category_id + '';
        cpitem.podcastId = item.podcast_id;
        cpitem._raw.id = item.id;
      }),
    );
    await database.batch(
      ...ctoupdate,
      ...ctocreate,
      ...updatedPodcasts,
      ...createdPodcasts,
      ...cptocreate,
    );
  });
};
TabOneScreen.whyDidYouRender = true;
function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}
export default withDatabase(TabOneScreen);
