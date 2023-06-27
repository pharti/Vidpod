import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState, memo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import EpisodeHeader from '../components/EpisodeHeader/newindex';
import RenderHtml from 'react-native-render-html';
require('autolink-js');
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import Autolink from 'react-native-autolink';
import { useDispatch, useSelector } from 'react-redux';
import { catchError } from 'rxjs/operators';
import { DownloadButton } from '../components/DownloadButton';
import { PlayButton } from '../components/PlayButton';
import ShareButton from '../components/ShareButton';
import {
  createEpisode,
  onPlayPausePress,
  updateEpisode,
} from '../database/functions';
import {
  currentSongSelector,
  setCurrentSong,
} from '../features/currentSongSlice';

const EpisodeScreen = props => {
  const route = useRoute();
  const [episode, setEpisode] = useState(route.params?.episode);
  const [podcast, setPodcast] = useState(route.params?.podcast);
  const getEpisode = () => {
    const url =
      'https://yidpod.com/wp-json/yidpod/v1/episodes?id=' +
      route.params?.id.replace('episodes_', '').replace('e', '');
    fetch(url, {
      method: 'GET',
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(res => res.json())
      .then(ep => {
        setEpisode(ep[0]);
      })
      .catch(error => console.log(error));
  };
  const getPodcast = () => {
    const url =
      'https://yidpod.com/wp-json/wp/v2/podcasts?include[]=' +
      route.params?.podcast_id;
    fetch(url, {
      method: 'GET',
      headers: {
        'cache-control': 'public, max-age=100,stale-while-revalidate=86400',
      },
    })
      .then(res => res.json())
      .then(p => {
        setPodcast(p[0]);
      })
      .catch(error => console.log(error));
  };
  useEffect(() => {
    if (!episode) {
      getEpisode();
    }
    if (!podcast) {
      getPodcast();
    }
  }, [route.params?.id]);
  // console.log(episode);

  const dispatch = useDispatch();

  // const episode = useSelector((state) => selectById(state, route.params.id));
  // const route.params?.podcast = useSelector((state) =>
  //   selectroute.params?.podcastById(state, episode?.route.params?.podcast_id),
  // );

  const currentSong = useSelector(currentSongSelector);
  const { width } = useWindowDimensions();

  // const activelyPlaying = useSelector(isplayingSelector);
  const onPress = async () => {
    if (episode) {
      if (props.episodeInfo && props.episodeInfo.id) {
        await updateEpisode(episode, podcast);
      } else {
        await createEpisode(episode, podcast);
      }
      dispatch(
        setCurrentSong({ episode_id: episode.id, podcast_id: podcast.id + '' }),
      );
      onPlayPausePress(
        currentSong.episode_id == episode.id ? currentSong.status : 'paused',
        episode.id,
        dispatch,
      );

      // if (currentSong.status == 'playing') {
      //   // dispatch(
      //   //   updateEpisode({
      //   //     id: episode.route.params?.podcast_id + '-' + episode.e_index,
      //   //     changes: { state: 'paused' },
      //   //   }),
      //   // );

      //   // await episode.updateState('paused');
      //   await TrackPlayer.pause();
      //   dispatch(setStatus('paused'));
      // } else {
      //   const trackIndex = await TrackPlayer.getCurrentTrack();
      //   if (trackIndex == null) {
      //     console.log('1');
      //     dispatch(
      //       setCurrentSong({ episode_id: episode.id, podcast_id: podcast.id }),
      //     );
      //     dispatch(setPosition(props.episodeInfo.position));
      //     playEpisode(episode.id);
      //     // await addTrack(episode, podcast?.title, props.episodeInfo.position);
      //   } else {
      //     const track = await TrackPlayer.getTrack(trackIndex);
      //     if (
      //       !track ||
      //       track.id.replace('e', '') != episode.id.replace('e', '')
      //     ) {
      //       console.log(2);
      //       dispatch(
      //         setCurrentSong({
      //           episode_id: episode.id,
      //           podcast_id: podcast.id,
      //         }),
      //       );
      //       dispatch(setPosition(props.episodeInfo.position));
      //       playEpisode(episode.id);

      //       // await addTrack(episode, podcast?.title, props.episodeInfo.position);
      //     }
      //   }
      //   // dispatch(
      //   //   updateEpisode({
      //   //     id: episode.route.params?.podcast_id + '-' + episode.e_index,
      //   //     changes: { playDate: new Date().getTime(), state: 'playing' },
      //   //   }),
      //   // );
      //   // await episode.updateState('playing');
      //   await TrackPlayer.play();
      // dispatch(setStatus('playing'));
    }
    // dispatch(setCurrentSong(episode.id));
    // }
  };
  if (!episode || !podcast) {
    return <ActivityIndicator size={'large'} color={'grey'} />;
  }
  return (
    <ScrollView style={styles.container}>
      <EpisodeHeader episode={episode} podcast={podcast} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPress}>
          <PlayButton
            isPlaying={
              currentSong.episode_id == episode.id &&
              currentSong.status == 'playing'
            }
          />
        </TouchableOpacity>

        <ShareButton
          shareString={`I'm listening to ${episode.title} on YidPod. Check it out at {link}`}
          suffix={route.params?.podcast_id + '/' + route.params?.id}
          image_uri={episode.image_uri}
          title={episode.title}
        />
        <DownloadButton
          episode_url={episode.url}
          id={'e' + episode.id.replace('e', '')}
          width={35}
          height={35}
          containerStyle={{
            justifyContent: 'center',
            marginLeft: 15,
            marginBottom: 5,
          }}
          episode={episode}
          podcast={podcast}
          cachedUrl={props.episodeInfo.cachedUrl}
        />
      </View>
      <EpisodeDescription w={width} description={episode.description} />
    </ScrollView>
  );
};
const EpisodeDescription = memo(props => {
  return (
    <View style={styles.textContainer}>
      {props.description.length > 0 && (
        <RenderHtml
          baseStyle={{ color: 'white' }}
          contentWidth={props.w}
          source={{ html: props.description.autoLink() }}
        />
      )}
    </View>
  );
});
const enhance = withObservables(
  ['database'],
  ({ route, navigation, database }) => ({
    episodeInfo: database
      .get('episodes')
      .findAndObserve('e' + route.params.id.replace('e', ''))
      .pipe(
        catchError(async err => {
          return { position: 0 };
        }),
      ),
  }),
);
export default withDatabase(enhance(EpisodeScreen));

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    overflow: 'scroll',
    // marginBottom: 15,
  },
  textContainer: {
    padding: 15,
    // marginBottom: 100,
  },
  text: {
    fontSize: 14,
    color: 'white',
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
