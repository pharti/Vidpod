import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { sendComment, userSelector } from '../../features/userSlice';

export const CommentForm = props => {
  const user = useSelector(userSelector);

  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  if (!user.wp_user || !user.wp_user.ID) {
    return null;
  }
  return (
    <>
      {user.wp_user || user.wp_user.ID ? (
        <>
          <SafeAreaView style={styles.textinputContainer}>
            <TextInput
              multiline={true}
              //   maxLength={40}
              onChangeText={setMessage}
              value={message}
              placeholder={'Share a comment...'}
              style={styles.textinput}
            />
          </SafeAreaView>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() =>
                dispatch(
                  sendComment({ podcast: props.podcast_id, message: message }),
                )
              }>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      {/* <View style={{ alignSelf: 'flex-start', paddingBottom: 10 }}>
        <Text style={styles.recent}>Recent Comments</Text>
      </View> */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  textinputContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: 75,
    borderRadius: 5,
  },
  textinput: {
    backgroundColor: 'white',
    // width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingRight: 30,

    paddingLeft: 30,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#F1F1F1',
    fontSize: 14,
    // letterSpacing:1.2,
    // fontWeight:'bold',
    // te
    // textTransform:'uppercase'
  },
  recent: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
