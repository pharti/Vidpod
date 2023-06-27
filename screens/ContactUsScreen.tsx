import React from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';

export const ContactUsScreen = (props: { close: () => any }) => {
  // const user = useSelector(userSelector);
  // const email = user.wp_user.data.user_email
  // we probably want to include the email in the message so chaim knows who to respond to
  const navigation = useNavigation();
  const [uri, seturi] = React.useState<[]>([]);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([
    { label: 'Feedback', value: 'general' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Bug Report', value: 'bug' },
    { label: 'New Podcast', value: 'podcast' },
    { label: 'Ad Request', value: 'ad' },
  ]);
  const route = useRoute();
  const [message, setMessage] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false);
  const [phone, setPhone] = React.useState('');
  const inputBox = React.useRef();
  const [questionType, setQuestionType] = React.useState('');
  const [prompt, setPrompt] = React.useState<String>(
    'Let us know your thoughts!',
  );
  const ref = React.useRef();
  React.useEffect(() => {
    if (questionType === 'general') {
      setPrompt('Let us know your thoughts!');
    }
    if (questionType === 'feature') {
      setPrompt('What feature(s) would you like to see in the app?');
    }
    if (questionType === 'bug') {
      setPrompt('Please describe the issue you are experiencing.');
    }
    if (questionType === 'podcast') {
      setPrompt(
        "Please include a link to the podcast you'd like to see added.",
      );
    }
    if (questionType === 'ad') {
      setPrompt('Message');
    }
  }, [questionType]);

  React.useEffect(() => {
    setTimeout(() => {
      setMessageSent(false);
      // navigation.goBack()e
    }, 10000);
  }, [messageSent]);
  React.useEffect(() => {
    if (route.params?.type) {
      setQuestionType(route.params?.type);
    }
  }, [route]);
  return (
    <TouchableWithoutFeedback onPress={() => setOpen(false)}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1 }}>
          {messageSent && (
            <View style={{ paddingBottom: 15, paddingLeft: 20 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>
                Message sent succesfully, we will get back to you shortly
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              //   flex: 1,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 26,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Contact Us
            </Text>
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              containerStyle={{
                height: 40,
                width: 150,
                marginTop: 20,
                marginBottom: 20,
              }}
              value={questionType}
              items={items}
              setItems={setItems}
              style={{ backgroundColor: '#fafafa' }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              setValue={setQuestionType}
            />
            <TextInput
              style={styles.textBox}
              placeholder="Name"
              placeholderTextColor="grey"
              autoCapitalize="words"
              value={name}
              onFocus={() => setOpen(false)}
              onChangeText={text => setName(text)}
            />
            <TextInput
              style={[styles.textBox, emailError ? styles.emailError : null]}
              placeholder="Email"
              placeholderTextColor="grey"
              autoCompleteType="email"
              autoCapitalize="none"
              value={email}
              onFocus={() => setOpen(false)}
              keyboardType="email-address"
              onChangeText={text => {
                setEmail(text);
                setEmailError(false);
              }}
            />
            {questionType == 'ad' ? (
              <TextInput
                style={[styles.textBox, emailError ? styles.emailError : null]}
                placeholder="Phone"
                placeholderTextColor="grey"
                autoCompleteType="tel"
                autoCapitalize="none"
                value={phone}
                onFocus={() => setOpen(false)}
                keyboardType="phone-pad"
                onChangeText={text => {
                  setPhone(text);
                  // setEmailError(false);
                }}
              />
            ) : null}
            <TextInput
              style={styles.messageBox}
              placeholder={prompt}
              autoCapitalize="none"
              multiline={true}
              value={message}
              onFocus={() => setOpen(false)}
              onChangeText={text => setMessage(text)}
            />
            <View
              style={{
                display: questionType == 'bug' ? 'flex' : 'none',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    //Get images for upload
                    const res = await DocumentPicker.pickMultiple({
                      type: [DocumentPicker.types.images],
                    });
                    seturi(res);
                  } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                      // User cancelled the picker, exit any dialogs or menus and move on
                    } else {
                      throw err;
                    }
                  }
                }}>
                <Text style={{ padding: 15 }}>Upload file</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                {uri.map(image => (
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 50, height: 50, marginRight: 5 }}
                  />
                ))}
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text>{emailError ? 'Please enter an email address' : ''}</Text>
            </View>
            <View style={{ marginTop: 10, marginBottom: 25 }}>
              <TouchableOpacity
                onPress={() => {
                  if (!email) {
                    setEmailError(true);
                    return;
                  }
                  setSending(true);

                  let data = new FormData();
                  for (const res of uri) {
                    data.append('file[]', {
                      uri: res.uri,
                      type: res.type,
                      name: res.name,
                    });
                  }

                  data.append('message', message);
                  data.append('name', name);
                  data.append('email', email);
                  data.append('phone', phone);
                  data.append('type', questionType);
                  data.append(
                    'device',
                    Platform.OS +
                      ' Version:' +
                      Platform.Version +
                      ' App Version: '+(Platform.OS == 'ios' ? '1.2.22' : '1.4.19'),

                  );
                  fetch('https://yidpod.com/wp-json/yidpod/v1/upload/file', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                    body: data,
                  })
                    .then(response => {
                      if (response.status == 200) {
                        setMessage('');
                        setName('');
                        setEmail('');
                        seturi([]);
                        setSending(false);
                      }

                      response.text();
                    })
                    .then(res => setMessageSent(true))
                    .catch(error => console.log(error));
                }}
                // disabled={sending}
              >
                <Text
                  style={{
                    fontSize: 14,
                    backgroundColor: '#1DB954',
                    color: 'lightgrey',
                    padding: 10,
                    borderRadius: 20,
                    alignSelf: 'flex-end',
                  }}>
                  Send Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingLeft: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  text: {
    marginLeft: 10,
  },
  closeContainer: {
    // position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    left: 0,
    color: 'white',
    // marginTop: 20,
    // zIndex: 10,
    // backgroundColor: 'red',
  },
  messageBox: {
    textAlignVertical: 'top',
    height: 100,
    width: 300,
    padding: 10,
    marginTop: 10,
    color: 'black',
    backgroundColor: 'lightgray',
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
  goBack: {
    marginBottom: 20,
  },
  name: {
    paddingBottom: 10,
    paddingLeft: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  emailError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  version: {
    color: '#eee',
    alignSelf: 'flex-end',
    fontSize: 12,
    marginBottom: 10,
  },
});
