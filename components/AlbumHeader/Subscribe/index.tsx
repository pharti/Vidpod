import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { sendSubscribe, sendUnsubscribe } from '../../../features/userSlice';

export const Subscribe = ({ podcast_id, subscribed, show, disable }) => {
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    // return;
    if (disable) {
      Alert.alert('Please log in to subscribe');
      return;
    }
    if (clicked) {
      dispatch(sendUnsubscribe(podcast_id));
      // await album.unsubscribe();
    } else {
      dispatch(sendSubscribe(podcast_id));
      // await album.subscribe();
    }
    setClicked(!clicked);
  }, [clicked, disable]);
  // useEffect(() => {
  //   fetch(
  //     'https://yidpod.com/wp-json/yidpod/v2/subscribe?podcast_id=' +
  //       podcast_id +
  //       '&user_id=' +
  //       (user.wp_user ? user.wp_user.ID : 0),
  //     { headers: { 'Content-type': 'application/json' } },
  //   )
  //     .then(res => res.json())
  //     .then(sub => {
  //       setSubscribed(sub);
  //     });
  // }, []);
  useEffect(() => {
    if (subscribed) {
      setClicked(true);
    }
  }, [subscribed]);
  return (
    <TouchableOpacity
      onPress={onPress}
    //   disabled={disable}
    // style={{ justifyContent: 'flex-start' }}
    >
      <View style={[styles.button, { display: show ? 'none' : 'flex' }]}>
        <Text style={styles.buttonText}>
          {!clicked ? 'Subscribe' : 'Unsubscribe'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = {
  button: {
    backgroundColor: '#1DB954',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#F1F1F1',
    fontSize: 15,
    // letterSpacing:1.2,
    // fontWeight:'bold',
    // te
    // textTransform:'uppercase'
  },
};
