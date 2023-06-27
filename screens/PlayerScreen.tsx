import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import { catchError } from 'rxjs/operators';
import PlayerActions from '../components/PlayerActions';
import PlayerHeader from '../components/PlayerHeader';
import { setPosition, setShow } from '../features/currentSongSlice';
import { StatusBarHeight } from '../js/statusbar';
import SpeedScreen from './SpeedScreen';

const PlayerScreen = ({ episode, podcast, bottom }) => {

  const [showSpeedScreen, setshowSpeedScreen] = useState<boolean>(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function handleBackButtonClick() {
    dispatch(setShow(true));
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  return (
    showSpeedScreen ? (
      <SpeedScreen
        hideScreen={() => setshowSpeedScreen(false)}
        imageUri={episode.imageUri}
      />
    ) : (
      <SafeAreaView
        style={[styles.container]}
      >
        <TouchableOpacity
          style={{
            // marginTop: StatusBarHeight,
          }}
          onPress={() => {
            dispatch(setShow(true));
          }}>

          <Icon name="chevron-thin-down" size={25} color="white" style={{ alignSelf: 'center', paddingVertical: 16 }} />
        </TouchableOpacity>
        <PlayerHeader
          podcast={podcast}
          episode={episode}
        />
        <PlayerActions
          episode={episode}
          podcast={podcast}
          bottom={bottom}
          disable
          showScreen={() => setshowSpeedScreen(true)}
          playCurrentTrack={async () => {
            dispatch(setPosition(episode.position));
          }}
        />
      </SafeAreaView>
    )
  );
};

const enhance = withObservables(
  ['episode_id', 'podcast_id', 'database'],
  ({ episode_id, podcast_id, database }) => {
    return {
      episode: database
        .get('episodes')
        .findAndObserve('e' + episode_id.replace('e', ''))
        .pipe(
          catchError(error => {
            console.log(error);
            return { position: 0 };
          }),
        ),
      podcast: database.get('podcasts').findAndObserve(podcast_id + ''),
    };
  },
);

export default withDatabase(enhance(PlayerScreen));

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    position: 'absolute',
    top: -Dimensions.get('window').height + StatusBarHeight + 10,
    paddingTop: StatusBarHeight,
    width: '100%',
    height: Dimensions.get('screen').height + StatusBarHeight + 10,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: StatusBarHeight,
  },
  icon: {
    position: 'relative',
    left: 10,
    top: 10,
  },
});
