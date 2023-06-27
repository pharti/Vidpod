import { useDatabase } from '@nozbe/watermelondb/hooks';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import ReactNativeBlobUtil from 'react-native-blob-util';
import TrackPlayer from 'react-native-track-player';
import { useDispatch } from 'react-redux';
import { createEpisode, setEpisodeUrl } from '../../database/functions';
import { setToast } from '../../features/generalSlice';
export const DownloadButton = (props: any) => {
  const [isdownload, setisDownload] = useState(props.cachedUrl ? 2 : 1);
  const database = useDatabase();
  const dispatch = useDispatch();
  if (props.cachedUrl && props.cachedUrl != '') {
    ReactNativeBlobUtil.fs.exists(props.cachedUrl).then(async value => {
      if (!value) {
        setisDownload(1);
        await database.write(async () => {
          const episode = await database.get('episodes').find(props.id);
          await episode.update(e => {
            e.cachedUrl = null;
          });
        });
      }
    });
  }
  const deleteFile = () => {
    ReactNativeBlobUtil.fs.unlink(props.cachedUrl).then(async () => {
      await database.write(async () => {
        const episode = await database.get('episodes').find(props.id);
        const h = await episode.update(e => {
          e.cachedUrl = null;
        });
      });
      setisDownload(1);
    });
  };
  useEffect(() => {
    if (!props.cachedUrl) {
      setisDownload(1);
    }
  }, [props.cachedUrl]);
  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        onPress={async () => {
          if (isdownload == 2) {
            deleteFile();
            return;
          }
          setisDownload(0);
          await ReactNativeBlobUtil.config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            path:
              ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + props.id + '.mp3',
            indicator: true,
            addAndroidDownloads: {
              useDownloadManager: true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification: true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              path: ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + props.id,
              description: 'File downloaded by download manager.',
            },
          })
            .fetch('GET', props.episode_url)
            .then(async res => {
              setisDownload(2);
              await database.write(async () => {
                database
                  .get('episodes')
                  .find(props.id)
                  .then(async episode => {
                    await episode.update(e => {
                      e.cachedUrl = res.path();
                    });
                  })
                  .catch(async error => {
                    await createEpisode(props.episode, null);
                    await setEpisodeUrl(props.id, res.path());
                  });
              });
              dispatch(setToast('Added to My Feed'));

              const trackIndex = await TrackPlayer.getCurrentTrack();
              // if (trackIndex != null) {
              //   const track = await TrackPlayer.getTrack(trackIndex);
              //   const position = await TrackPlayer.getPosition();
              //   if (track && track.id == episode.id) {
              //     await TrackPlayer.remove(trackIndex);
              //     dispatch(setPosition(position));
              //     await addTrack(h, track.album ? track.album : '', position);
              //   }
              // }
            })
            .catch(error => {
              console.log(error);
            });
        }}>
        {isdownload == 0 ? (
          <ActivityIndicator color="white" size={'small'} />
        ) : (
          <Image
            source={
              isdownload == 1
                ? require('../../assets/images/download.png')
                : require('../../assets/images/downloaded.png')
            }
            style={{ width: props.width, height: props.height }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
