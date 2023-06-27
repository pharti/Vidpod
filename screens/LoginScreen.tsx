import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import { generalSelector, setError } from '../features/generalSlice';
import {
  loginUser,
  passwordForgot,
  registerUser,
  setSkip,
  userSelector,
} from '../features/userSlice';
const userErrorText = {
  invalid_username: 'The username you have entered is invalid.',
  incorrect_password: 'Incorrect password',
  406: 'Username already exists, please enter another username',
  empty_password: 'The password field is empty.',
  invalid_email: 'The email you have entered in invalid',
};
export const LoginScreen = () => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  // const [isLogin, setIsLogin] = React.useState<boolean>(true);
  const [page, setPage] = React.useState('login');
  const user = useSelector(userSelector);
  // const [login, setLogin] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState('');
  const { loading, error } = useSelector(generalSelector);
  const dispatch = useDispatch();
  const loginRegisterPress = () => {
    if (page == 'login') {
      setPage('register');
    }
    if (page == 'register') {
      setPage('login');
    }
    if (page == 'forgot') {
      setPage('login');
    }
  };
  const forgotPassword = () => {
    setPage('forgot');
  };
  function validateEmail(email: string) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  // React.useEffect(() => {
  //   if (user.skip || user.loggedIn) {
  //     if (navigation.canGoBack()) {
  //       navigation.goBack();
  //     } else {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{ name: 'HomeScreen' }],
  //       });
  //     }
  //   }
  // }, [user.skip, user.loggedIn]);
  return (
    <View style={styles.container}>
      <View style={styles.upperSkip}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSkip(true));
          }}>
          <Text style={{ fontSize: 16, padding: 20, marginTop: 20 }}>
            Sign up later
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.boxContainer}>
        <Text style={styles.title}>
          {page == 'forgot' ? 'forgot my pasword' : page}
        </Text>

        <TextInput
          style={styles.textBox}
          placeholder="Enter Email"
          placeholderTextColor="grey"
          autoCapitalize="none"
          textContentType="emailAddress"
          onChangeText={text => setEmail(text.trim())}
        />

        <TextInput
          style={[
            styles.textBox,
            { display: page == 'forgot' ? 'none' : 'flex' },
          ]}
          autoCapitalize="none"
          placeholder="Enter Password"
          placeholderTextColor="grey"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        {error ? (
          <View style={styles.errorText}>
            <Text>{userErrorText[error]}</Text>
          </View>
        ) : null}
        <View style={styles.loginButton}>
          <Button
            onPress={() => {
              if (validateEmail(email)) {
                if (page == 'login') {
                  dispatch(loginUser({ username: email, password }));
                }
                if (page == 'register') {
                  dispatch(registerUser({ email, password }));
                }
                if (page == 'forgot') {
                  dispatch(passwordForgot({ username: email }));
                  Keyboard.dismiss();
                  setMessage(
                    'A reset password link has been sent to your email',
                  );
                }
              } else {
                dispatch(setError('invalid_email'));
              }
            }}
            title={
              page == 'login'
                ? 'Sign In'
                : page == 'register'
                ? 'Sign up'
                : 'Reset Password'
            }
          />
        </View>
        <View style={{ marginTop: 5, padding: 5 }}>
          <TouchableOpacity onPress={loginRegisterPress}>
            <Text style={styles.loginRegister}>
              {page == 'login'
                ? 'Register'
                : page == 'register'
                ? 'I have an account'
                : 'Go back'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={forgotPassword}>
          <Text style={styles.forgotPassword}>
            {page == 'login' ? 'Forgot my password' : ''}
          </Text>
        </TouchableOpacity>
        <Text>{message}</Text>
      </View>

      <View style={styles.skip}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSkip(true));
          }}>
          <Text style={{ fontSize: 16, padding: 20 }}>Sign up later</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size={'large'}
            color="#00ffff"
            style={{ top: '50%' }}
          />
        </View>
      ) : null}
    </View>
  );
};
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  boxContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  loginButton: {
    paddingTop: 30,
    width: '100%',
  },
  textBox: {
    height: 50,
    padding: 10,
    marginTop: 10,
    width: '100%',
    color: 'black',
    backgroundColor: 'lightgray',
  },
  errorText: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  loginRegister: {
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  forgotPassword: {
    // textDecorationLine: 'underline',
    fontSize: 14,
  },
  skip: {
    position: 'absolute',
    bottom: 60,
    right: 0,
  },
  upperSkip: {
    position: 'absolute',
    top: 60,
    right: 0,
  },
  loading: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.5,
  },
});
