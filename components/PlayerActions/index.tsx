import React from 'react';
import { ActivityIndicator, Dimensions, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { onPlayPausePress } from '../../database/functions';
import {
  currentSongSelector,
  setPosition,
  setSliding,
} from '../../features/currentSongSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import ShareButton from '../ShareButton';
import styles from './styles';

const PlayerActions = props => {
  const disable = !props.disable || false;
  const dispatch = useDispatch();
  const { podcast, episode, onPressListIcon } = props;
  // const playSpeed = useSelector(playSpeedSelector);
  // const podcast = useSelector((state: any) => selectById(state, podcast_id));
  const episodesLength = 10;
  const { playSpeed, status } = useSelector(currentSongSelector);

  const { width, height } = Dimensions.get('window');
  return (
    <View
      style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
        }}>
        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: 'white', borderRadius: 4, width: 48, height: 48, justifyContent: "center", alignItems: 'center' }}
          onPress={() => {
            props.showScreen();
          }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{playSpeed + 'x'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            dispatch(setSliding(true));
            const position = await TrackPlayer.getPosition();
            await TrackPlayer.seekTo(Math.round(position) - 15);
            dispatch(setPosition(Math.round(position) - 15));
            dispatch(setSliding(false));
          }}
        >
          <Image
            source={require('../../assets/images/backward-15.png')}
            style={{ width: 35, height: 40 }}
            onError={error => console.log(error.nativeEvent.error)}
          />
        </TouchableOpacity>
        {disable && (
          <TouchableOpacity onPress={async () => { }}>
            <FontAwesome
              name={'step-backward'}
              size={30}
              color={episode.eIndex > 0 ? 'white' : 'grey'}
            />
          </TouchableOpacity>
        )}
        <View
          style={styles.playButton(status)}>
          <TouchableOpacity
            onPress={() => {
              // dispatch(
              //   setCurrentSong({
              //     episode: episode.id,
              //     podcast: podcast.id,
              //   }),
              // );
              onPlayPausePress(status, episode.id, dispatch);
              // if (status == 'playing') {
              //   await TrackPlayer.pause();
              //   dispatch(setStatus('paused'));
              //   // await episode.updateState('paused');
              // } else {
              //   const trackIndex = await TrackPlayer.getCurrentTrack();
              //   if (trackIndex == null) {
              //     dispatch(
              //       setCurrentSong({
              //         episode: episode.id,
              //         podcast: podcast.id,
              //       }),
              //     );
              //     playEpisode(episode.id);
              //     // props.playCurrentTrack();
              //   } else {
              //     const track = await TrackPlayer.getTrack(trackIndex);
              //     if (!track || track.id != props.episode.id) {
              //       dispatch(
              //         setCurrentSong({
              //           episode: episode.id,
              //           podcast: podcast.id,
              //         }),
              //       );
              //       playEpisode(episode.id);

              //       // props.playCurrentTrack();
              //     }
              //   }
              //   dispatch(setStatus('playing'));
              //   // await episode.updateState('playing');
              //   await TrackPlayer.play();
              // }
            }}
            disabled={status == 'buffering'}>
            {status == 'buffering' ? (
              <ActivityIndicator size={26} color={'black'} />
            ) : (
              <FontAwesome
                name={status == 'playing' ? 'pause' : 'play'}
                size={26}
                color={'black'}
              />
            )}
          </TouchableOpacity>
        </View>
        {disable && (
          <TouchableOpacity
            onPress={async () => { }}
            disabled={!(episodesLength && episode.eIndex < episodesLength - 1)}>
            <FontAwesome
              name={'step-forward'}
              size={30}
              color={
                episodesLength && episode.eIndex < episodesLength - 1
                  ? 'white'
                  : 'grey'
              }
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={async () => {
            // const position = episode.position;
            dispatch(setSliding(true));
            const position = await TrackPlayer.getPosition();
            // await episode.updatePosition(Math.round(position) + 15);
            await TrackPlayer.seekTo(Math.round(position) + 15);
            dispatch(setPosition(Math.round(position) + 15));
            dispatch(setSliding(false));
          }}>
          <Image
            source={require('../../assets/images/forward-15.png')}
            style={{ width: 35, height: 40 }}
            onError={error => console.log(error.nativeEvent.error)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressListIcon()}>
          <Icon name="playlist-play" size={56} color="white" style={{ alignSelf: 'center', paddingVertical: 16 }} />
        </TouchableOpacity>
        {/* <ShareButton
          shareString={`I'm listening to ${episode.title} on YidPod. Check it out at {link}`}
          suffix={podcast.id + '/' + episode.id}
          image_uri={episode.imageUri}
          title={episode.title}
        /> */}
      </View>
    </View>
  );
};

export default PlayerActions;
