import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

import { FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import { playSpeedSelector, setPlaySpeed } from '../features/currentSongSlice';
const changePlaySpeed = async (playSpeed: any) => {
  await TrackPlayer.setRate(playSpeed);
};
const keyExtractor = (index, item) => index + 'x';

export default function SpeedScreen(props: any) {
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const speeds = [0.5, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5, 3, 3.5];
  // const episode_id = useSelector(episodeIdSelector);
  // const episodeInfo = useSelector(
  //   (state) => episodeInfoSelector(state, episode_id),
  //   shallowEqual,
  // );
  const playSpeed = useSelector(playSpeedSelector);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ alignSelf: 'center' }}>
        <Image source={{ uri: props.imageUri }} style={styles.image} />
        <Text style={styles.text}>Change Speed</Text>
      </View>
      <FlatList
        data={speeds}
        keyExtractor={keyExtractor}
        renderItem={useCallback(({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={async () => {
                dispatch(setPlaySpeed(item));
                changePlaySpeed(item);
                props.hideScreen();
              }}>
              <Text style={{ color: 'white', fontSize: 18, margin: 10 }}>
                {playSpeed == item ? <Icon name="check" size={18} /> : null}
                {item + 'x'}
              </Text>
            </TouchableOpacity>
          );
        }, [])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // top: StatusBarHeight,
    paddingTop: 50,

    // backgroundColor: 'black',
    // width: '100%',
    // height: Dimensions.get('screen').height,
    // left: 0,
  },
  image: { width: 150, height: 150 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});
