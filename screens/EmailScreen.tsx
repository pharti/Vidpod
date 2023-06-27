import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

import useSWRNative from '@nandorojo/swr-react-native';
import { Picker } from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';
import { useSelector } from 'react-redux';
import { userSelector } from '../features/userSlice';
import { useRoute } from '@react-navigation/native';

const fetcher = url => fetch(url).then(res => res.json());

export const EmailScreen = () => {
  const user = useSelector(userSelector);
  const route = useRoute();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(
    user.wp_user && user.wp_user.data ? user.wp_user.data.user_email : '',
  );
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Contact podcaster</Text>

      <TextInput
        style={styles.textBox}
        placeholder="Name"
        placeholderTextColor="grey"
        autoCapitalize="words"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.textBox}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.messageBox}
        placeholder="Message"
        multiline={true}
        placeholderTextColor="grey"
        value={message}
        onChangeText={text => setMessage(text)}
      />

      <TouchableOpacity
        onPress={() => {
          let t = '';
          if (!name) {
            t += 'Please enter a name\n';
          }
          if (!email) {
            t += 'Please enter an email\n';
          }
          if (!message) {
            t += 'Please enter a message\n';
          }

          if (t) {
            setText(t);
            return;
          }

          setSending(true);
          setText('');
          fetch('https://yidpod.com/wp-json/yidpod/v2/send/message', {
            method: 'POST',
            body: JSON.stringify({
              message: message,
              email: email,
              name: name,
              podcast_id: route.params?.podcast_id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (response.status == 200) {
                setMessage('');
                setName('');
                // setEmail('');
                setSending(false);
                setText('The message was sent.');
              }

              return response.text();
            })
            .catch(error => console.log(error));
        }}
        disabled={sending}>
        <Text style={styles.button}>
          {sending ? (
            <ActivityIndicator size={'small'} color="white" />
          ) : (
            'Send Message'
          )}
        </Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>
        {text}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topText: {
    color: 'white',
    fontSize: 20,
    marginTop: 25,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: 'white',
    width: 200,
    height: 200,
  },
  textBox: {
    textAlignVertical: 'top',
    height: 40,
    width: 300,
    padding: 10,
    marginTop: 10,
    color: 'black',
    backgroundColor: 'lightgray',
  },
  messageBox: {
    textAlignVertical: 'top',
    height: 300,
    width: 300,
    padding: 10,
    marginTop: 10,
    color: 'black',
    backgroundColor: 'lightgray',
  },
  option: {
    backgroundColor: 'white',
    color: 'black',
  },
  options: {
    backgroundColor: 'white',
    color: 'black',
  },
  overlay: {
    marginTop: 10,
  },
  button: {
    fontSize: 14,
    backgroundColor: '#1DB954',
    color: 'lightgrey',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
});
