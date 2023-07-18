import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, Text, View } from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useDispatch } from 'react-redux';
import { catchError } from 'rxjs/operators';
import PlayerActions from '../components/PlayerActions';
import PlayerHeader from '../components/PlayerHeader';
import { setPosition, setShow } from '../features/currentSongSlice';
import { StatusBarHeight } from '../js/statusbar';
import SpeedScreen from './SpeedScreen';
import { Divider } from 'react-native-elements';

const screenWidth = Dimensions.get('screen').width;

const PlayerScreen = ({ episode, podcast, bottom }) => {

  const [showSpeedScreen, setshowSpeedScreen] = useState<boolean>(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
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

  // ref
  const playerOptionsSheetRef = useRef<ActionSheetRef>(null);
  const playerPlaylistSheetRef = useRef<ActionSheetRef>(null);


  return (
    showSpeedScreen ? (
      <SpeedScreen
        hideScreen={() => setshowSpeedScreen(false)}
        imageUri={episode.imageUri}
      />
    ) : (
      <>
        <SafeAreaView
          style={[styles.container]}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(setShow(true));
            }}>

            <Icon name="chevron-thin-down" size={25} color="white" style={{ alignSelf: 'center', paddingVertical: 16 }} />
          </TouchableOpacity>
          <PlayerHeader
            podcast={podcast}
            episode={episode}
            showOptions={() => playerOptionsSheetRef.current?.show()}
            imageDimensions={{ height: screenWidth - 48, width: screenWidth - 48 }}
            showOptionsIcon={true}
            showSlider={true}
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
            onPressListIcon={() => playerPlaylistSheetRef.current.show()}
          />

        </SafeAreaView>

        {/* ... Player Options( Share, Download, Add to Playlist etc) */}
        <ActionSheet ref={playerOptionsSheetRef} isModal={true} containerStyle={{ height: '100%', backgroundColor: '#242424' }}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                playerOptionsSheetRef.current?.hide()
              }}>
              <Icon name="chevron-thin-down" size={25} color="white" style={{ alignSelf: 'center', paddingVertical: 16 }} />
            </TouchableOpacity>
            <PlayerHeader
              podcast={podcast}
              episode={episode}
              showOptions={() => playerOptionsSheetRef.current?.show()}
              imageDimensions={{ height: screenWidth - 128, width: screenWidth - 128 }}
            />
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: "bold" }}>Download</Text>
                <MaterialIcons name="file-download" size={32} color="white" />
              </View>
              <Divider style={{ marginVertical: 16 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: "bold" }}>Share</Text>
                <MaterialIcons name="share" size={32} color="white" />
              </View>
              <Divider style={{ marginVertical: 16 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: "bold" }}>Add to Queue</Text>
                <MaterialIcons name="add-box" size={32} color="white" />
              </View>
              <Divider style={{ marginVertical: 16 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: "bold" }}>Add to Playlist</Text>
                <MaterialIcons name="add-box" size={32} color="white" />
              </View>
            </View>
          </SafeAreaView>
        </ActionSheet>

        <ActionSheet ref={playerPlaylistSheetRef} isModal={true} containerStyle={{ height: '100%', backgroundColor: '#242424' }}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                playerPlaylistSheetRef.current?.hide()
              }}>
              <Icon name="chevron-thin-down" size={25} color="white" style={{ alignSelf: 'center', paddingVertical: 16 }} />
            </TouchableOpacity>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
              <View style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: "bold" }}>Now Playing</Text>
              </View>
            </View>
          </SafeAreaView>
        </ActionSheet>
      </>
    )
  );
};

const enhance = withObservables(
  ['episode_id', 'podcast_id', 'database'],
  ({ episode_id, podcast_id, database }) => {
    return {
      episode: database
        .get('episodes')
        .findAndObserve('e' + episode_id?.replace('e', ''))
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
    backgroundColor: '#242424',
    position: 'absolute',
    top: -Dimensions.get('window').height + StatusBarHeight + 16,
    paddingTop: StatusBarHeight,
    height: Dimensions.get('screen').height + StatusBarHeight + 10,
    flex: 1,
    zIndex: 0
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
