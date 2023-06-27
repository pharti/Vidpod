import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
// import EditScreenInfo from '../components/EditScreenInfo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Text, View } from '../components/Themed';
import { setSkip, setWpUser, userSelector } from '../features/userSlice';

export default function TabTwoScreen() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [contactFormOpen, setContactFormOpen] = React.useState<Boolean>(false);
  const logoutUser = () => {
    // if (user.loggedIn) {
    dispatch(setWpUser(null));
    dispatch(setSkip(false));
    // }
  };
  return (
    <View style={styles.container}>
      <View style={styles.closeContainer}>
        <TouchableOpacity
          style={{
            padding: 20,
            marginTop: 20,

            alignSelf: 'flex-end',
          }}
          onPress={() => {
            // if (contactFormOpen) {
            //   setContactFormOpen(false);
            // } else {
            navigation.goBack();
            // }
          }}>
          <Icon name={'close'} size={25} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'flex-end',
          flex: 1,
          alignItems: 'flex-start',
          marginTop: 50,
        }}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://thechesedfund.com/yidpod/helpusgrow')
          }>
          <Text style={styles.title}>
            <FontAwesome
              name="heart"
              size={16}
              color={'white'}

              // style={{ padding: 10, backgroundColor: 'red' }}
            />
            <Text>{'  '}Donate</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SubmitPodcastScreen')}>
          <Text style={styles.title}>
            <FontAwesome
              name="plus-circle"
              size={16}
              color={'white'}

              // style={{ padding: 10, backgroundColor: 'red' }}
            />
            <Text>{'  '}Submit a Podcast</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://jewishpodcasts.fm')}>
          <Text style={styles.title}>
            <FontAwesome
              name="microphone"
              size={16}
              color={'white'}

              // style={{ padding: 10, backgroundColor: 'red' }}
            />
            <Text>{'  '}Start a podcast</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ContactUsScreen');
          }}>
          <Text style={styles.title}>
            <FontAwesome
              name="envelope"
              size={16}
              color={'white'}

              // style={{ padding: 10, backgroundColor: 'red' }}
            />
            <Text>{'  '}Contact Us</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://yidpod.com/become-a-yidpod-beta-tester/')
          }>
          <Text style={styles.title}>
            <FontAwesome
              name="flask"
              size={16}
              color={'white'}

              // style={{ padding: 10, backgroundColor: 'red' }}
            />
            <Text>{'  '}Become a Beta Tester</Text>
          </Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: 'white',
            width: '90%',
            paddingTop: 1,
            marginBottom: 10,
            marginRight: 20,
            marginLeft: 20,
          }}
        />
        <View>
          {user.wp_user &&
            user.wp_user.data &&
            user.wp_user.data.user_login && (
              <Text style={styles.name}>
                {user.wp_user.data.display_name
                  ? user.wp_user.data.display_name
                  : user.wp_user.data.user_login}
              </Text>
            )}
        </View>

        <TouchableOpacity onPress={logoutUser}>
          <Text style={styles.title}>
            <FontAwesome
              name={user.loggedIn ? 'sign-out' : 'sign-in'}
              size={16}
              color={'white'}
            />
            <Text>{user.loggedIn ? '  Logout' : '  Login'}</Text>
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
          }}>
          <Text style={styles.version}>
            Version: {Platform.OS == 'ios' ? '1.2.23' : '1.4.19'}
          </Text>
        </View>
      </View>
    </View>
  );
}

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
