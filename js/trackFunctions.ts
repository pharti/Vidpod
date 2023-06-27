import TrackPlayer from 'react-native-track-player';
import analytics from '@react-native-firebase/analytics';

import { convertDurationtoMs } from './time';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { setEpisodeUrl } from '../database/functions';

export const addTrack = async (episodeInfo: {url: string,cachedUrl:string | null,duration: string,id: string,imageUri: string,title: string,author: string},podcast_title:string,position:number) => {
  if (!episodeInfo || !episodeInfo.duration) {
    return;
  }
  let url = episodeInfo.url;
  let dirs = ReactNativeBlobUtil.fs.dirs;
  if(episodeInfo.cachedUrl){
    const exists = await ReactNativeBlobUtil.fs.exists(episodeInfo.cachedUrl);
    if(exists){
      url = episodeInfo.cachedUrl;
    }else{
      //fix this;
      setEpisodeUrl(null);
      // await episodeInfo.updateCachedUrl(null)
      // dispatch(updateEpisode({id:episodeInfo.id,changes:{cachedUrl: null}}));
    }
    
  }
  const duration = episodeInfo.duration.indexOf(':') > -1
          ? (convertDurationtoMs(episodeInfo.duration))
          : parseFloat(episodeInfo.duration);
  const queue = await TrackPlayer.getQueue();
  const skipIndex = queue.findIndex(e => e.id == episodeInfo.id);
  if(skipIndex >-1){
    TrackPlayer.skip(skipIndex).then(()=>{
      if (position !== undefined) {

        TrackPlayer.seekTo(position >= duration - 5 ? 0 : position);
      }
    });
    await TrackPlayer.play();

    
  }else{
    TrackPlayer.add({
      id: episodeInfo.id,
      url: url,
      title: episodeInfo.title,
      artist: episodeInfo.author,
      artwork: episodeInfo.imageUri,
      album: podcast_title,
      duration: duration,
      iosInitialTime: position,
      userAgent:'Yidpod',
      headers:{
        "User-Agent":'Yidpod',
      }
    }).then(async ()=>{
      if (episodeInfo.id) {
        if(queue.length > 0){
          await TrackPlayer.skip(queue.length);
        }
  
        }
      
      if (position !== undefined) {
        await TrackPlayer.seekTo(position >= duration - 5 ? 0 : position);
      }
      await TrackPlayer.play();
      analytics().logEvent('playedSong', {
        id: episodeInfo.id,
        title: episodeInfo.title,
        album: podcast_title,
        podcast_id: episodeInfo.id,
      })
    });
    
    
  }
 
  
  
    // return true;

  }
