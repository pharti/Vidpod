import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Top = props => {
  const setShows = useCallback(() => {
    props.setType('Shows');
  }, []);
  const setEpisodes = useCallback(() => {
    props.setType('Episodes');
  }, []);
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={setEpisodes}>
        <View
          style={[
            styles.activeButtonContainer,
            props.type == 'Episodes' ? styles.activeButton : null,

            // activeButton === 'Latest' && { backgroundColor: '#1DB954' },
          ]}>
          <Text style={[styles.activeButtons]}>Episodes</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={setShows}>
        <View
          style={[
            styles.activeButtonContainer,
            props.type == 'Shows' ? styles.activeButton : null,
          ]}>
          <Text
            style={[
              styles.activeButtons,
              {
                borderLeftWidth: 1,
                // borderLeftColor: '#333',
                paddingLeft: 5,
              },
              ,
            ]}>
            Shows
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  activeButtonContainer: {
    color: 'white',
    // padding: 10,
    // borderColor: 'white',
    backgroundColor: 'black',
  },
  activeButtons: {
    color: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    textDecorationColor: '#1DB954',
    paddingBottom: 15,

    // backgroundColor: '#1DB954',
  },
  activeButton: {
    color: 'white',
    borderBottomColor: '#1DB954',
    borderBottomWidth: 1,
  },
});
export default memo(Top);
