import { database } from '.';
import { addTrack } from '../js/trackFunctions';
import { setStatus } from '../features/currentSongSlice';
import TrackPlayer from 'react-native-track-player';
import { useLayoutEffect } from 'react';
export const createPodcast = async podcast => {
  return await database.write(async () => {
    await database
      .get('podcasts')
      .create(newpodcast => {
        newpodcast.author = podcast.author;
        newpodcast.imageUri = podcast.imageUri
          ? podcast.imageUri
          : podcast.image_uri;
        newpodcast.description = podcast.description;
        newpodcast.title = podcast.title;
        newpodcast._raw.id = podcast.id + '';
        newpodcast.type = podcast.type;
        newpodcast.likes = podcast.likes;
      })
      .catch(error => console.log(error));
  });
};
export const updatePodcast = async podcast => {
  return await database.write(async () => {
    const a = await database.get('podcasts').find(podcast.id + '');

    await a.update(oldpodcast => {
      oldpodcast.author = podcast.author;
      oldpodcast.imageUri = podcast.imageUri;
      oldpodcast.description = podcast.description;
      oldpodcast.title = podcast.title;
      oldpodcast.type = podcast.type;
      oldpodcast.likes = podcast.likes;
    });
  });
};
const checkPodcastExists = (id, podcast) => {
  return new Promise((resolve, reject) => {
    database
      .get('podcasts')
      .find(id + '')
      .then(res => {
        resolve(true);
      })
      .catch(async error => {
        await createPodcast(podcast);
        resolve(true);
      });
  });
};
export const createEpisode = async (episode, podcast) => {
  if (podcast) {
    await checkPodcastExists(episode.podcast_id, podcast);
  }
  return await database.write(async () => {
    await database
      .get('episodes')
      .create(e => {
        e._raw.id = 'e' + episode.id.replace('e', '');
        e.imageUri = episode.image_uri
          ? episode.image_uri
          : 'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
            episode.podcast_id;
        e.title = episode.title;
        e.position = 0;
        e.description = episode.description;
        e.author = episode.author;
        e.duration = episode.duration;
        e.content = episode.content;
        e.url = episode.url;
        e.eIndex = parseInt(episode.e_index);
        e.wId = episode.w_id;
        e.description = episode.description;
        e.likes = episode.likes;
        e.publishedDate = parseInt(episode.published_date);
        e._raw.podcast_id = episode.podcast_id + '';
      })
      .catch(async error => {
        // const a = await database
        //   .get('episodes')
        //   .find('e' + episode.id.replace('e', ''));
        await updateEpisode(episode, podcast);
      });
  });
};
export const updateEpisode = async (episode, podcast) => {
  if (podcast) {
    await checkPodcastExists(episode.podcast_id, podcast);
  }
  return await database.write(async () => {
    const a = await database
      .get('episodes')
      .find('e' + episode.id.replace('e', ''));
    await a.update(e => {
      e.imageUri = episode.image_uri
        ? episode.image_uri
        : 'https://yidpod.com/wp-json/yidpod/v2/images?podcast_id=' +
          episode.podcast_id;

      e.title = episode.title;
      e.description = episode.description;
      e.author = episode.author;
      e.duration = episode.duration;
      e.content = episode.content;
      e.url = episode.url;
      e.eIndex = parseInt(episode.e_index);
      e.wId = episode.w_id;
      e.description = episode.description;
      e.likes = episode.likes;
      e.publishedDate = parseInt(episode.published_date);
      e._raw.podcast_id = episode.podcast_id + '';
    });
  });
};
export const playEpisode = async id => {
  const episode = await database
    .get('episodes')
    .find('e' + id.replace('e', ''));
  await TrackPlayer.pause();
  await addTrack(
    {
      cachedUrl: episode.cachedUrl,
      url: episode.url,
      imageUri: episode.imageUri,
      id: episode.id,
      duration: episode.duration,
      title: episode.title,
      author: episode.author,
    },
    episode.podcast.title,
    episode.position,
  );
  return;
};
export const getEpisode = () => {
  database
    .get('episodes')
    .find('e44244334')
    .then(epis => {
      console.log(epis);
    });
};
export const setEpisodeUrl = async (episode_id, url) => {
  try {
    const episode = await database.get('episodes').find(episode_id);
    await episode.updateCachedUrl(url);
  } catch (error) {
    console.log(error);
  }
};
export const updatePosition = async (episode_id, position) => {
  await database.write(async () => {
    const e = await database
      .get('episodes')
      .find('e' + episode_id.replace('e', ''));
    await e.update(ep => {
      ep.position = position;
      ep.playDate = new Date().getTime();
    });
  });
};
export const updatePlayDate = async episode_id => {
  await database.write(async () => {
    const e = await database
      .get('episodes')
      .find('e' + episode_id.replace('e', ''));
    await e.update(ep => {
      ep.playDate = new Date().getTime();
    });
    const podcast = await database.get('podcasts').find(e.podcast.id);
    await podcast.update(p => {
      p.playDate = new Date().getTime();
    });
  });
};
// getEpisode();
export const onPlayPausePress = async (status, episode_id, dispatch) => {
  if (status == 'playing') {
    // dispatch(
    //   updateEpisode({
    //     id: props.episode_id,
    //     changes: { state: 'paused' },
    //   }),
    // );

    await TrackPlayer.pause();
    dispatch(setStatus('paused'));

    // await episode.updateState('paused');
    // });
  } else {
    const trackIndex = await TrackPlayer.getCurrentTrack();
    if (trackIndex == null) {
      await playEpisode(episode_id);
      // await addTrack(episode, podcast.title, episode.position);

      // dispatch(playCurrentSong(0));
    } else {
      const track = await TrackPlayer.getTrack(trackIndex);
      if (!track || track.id.replace('e', '') != episode_id.replace('e', '')) {
        await playEpisode(episode_id);

        // await addTrack(episode, podcast.title, episode.position);
      } else {
        await TrackPlayer.play();
      }
    }

    // realm.write(() => {
    //   const episode = realm.objectForPrimaryKey(
    //     'Episode',
    //     props.episode_id,
    //   );
    //   status = 'playing';
    //   episode.playDate = new Date().getTime();
    // });
    dispatch(setStatus('playing'));
    updatePlayDate(episode_id);
    // await episode.updateState('playing');
    // });
    // });
  }
};
