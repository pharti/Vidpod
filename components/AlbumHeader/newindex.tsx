import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Autolink from 'react-native-autolink';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { userSelector } from '../../features/userSlice';

import ShareButton from '../ShareButton';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// import {Album} from '../../types'
import useSWRNative from '@nandorojo/swr-react-native';
import { Notify } from './Notify';
import styles from './styles';
import { Subscribe } from './Subscribe';
import sendEmail from 'react-native-email';
import { useNavigation } from '@react-navigation/native';
import { CommentForm } from '../CommentForm';

export type AlbumHeaderProps = {
  album: any;
  termChanged: any;
  commentsClicked: any;
  showComments: boolean;
};
const fetcher = key => {
  return fetch('https://yidpod.com/wp-json/yidpod/v2/' + key).then(res =>
    res.json(),
  );
};
const AlbumHeader = (props: AlbumHeaderProps) => {
  const { album } = props;
  const navigation = useNavigation();
  const user = useSelector(userSelector);
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [showEmail, setShowEmail] = useState(false);
  const [term, setTerm] = useState('');
  const { data, error } = useSWRNative(
    'podcasts/' +
    album?.id +
    '/info?user_id=' +
    (user.wp_user ? user.wp_user.ID : 0),
    fetcher,
  );

  const [clicked, setClicked] = useState(false);
  // const podcast = useSelector((state) => selectById(state, album.id));

  const searchClicked = () => {
    if (clicked) {
      setTerm('');
    }
    setClicked(!clicked);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      props.termChanged(term);
    }, 500);

    return () => clearTimeout(timer);
  }, [term]);
  const emailTo = useCallback(() => {
    navigation.navigate('EmailScreen', { podcast_id: album.id });
    // sendEmail(album.email, { checkCanOpen: false });
  }, []);
  if (!album || !album.title) {
    return null;
  }
  const title = album?.title.rendered ? album.title.rendered : album.title;
  // const description = album?.description.replace(/<\/?[^>]+(>|$)/g, '');
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          // backgroundColor: '#242424',
          padding: 10,
        }}>
        {album?.imageUri ? (
          <Image source={{ uri: album?.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.noimage}></View>
        )}
        <View
          style={{
            flex: 1,
            marginLeft: 15,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...styles.name,
              fontSize: title.length < 20 ? 26 : title.length > 35 ? 20 : 22,
            }}>
            {decodeURI(title)}
          </Text>
          <Text style={styles.author}>{decodeURI(album?.author)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Subscribe
          show={clicked}
          subscribed={data && data.subscribed}
          podcast_id={album.id}
          disable={!user.loggedIn}
        />
        <View style={[styles.rightContainer]}>
          <View
            style={[
              styles.shareButton,
              {
                display: clicked ? 'none' : album.email ? 'flex' : 'none',
              },
            ]}>
            <TouchableOpacity
              onPress={emailTo}
              style={{
                justifyContent: 'center',
                marginLeft: 5,
              }}>
              <Icon name="send" size={30} color="white" />
            </TouchableOpacity>
          </View>
          {/* <View style={{ paddingLeft: 15 }}>
            <TouchableOpacity onPress={props.commentsClicked}>
              <FontAwesome5 name={'comment-alt'} size={30} color="white" />
            </TouchableOpacity>
          </View> */}
          <View
            style={[
              styles.shareButton,
              { display: clicked ? 'none' : 'flex' },
            ]}>
            <ShareButton
              shareString={`I'm listening to ${title} on YidPod. Check it out at {link}`}
              suffix={album?.id}
              image_uri={album?.imageUri}
              title={title}
            />
          </View>
          <View
            style={[styles.bellButton, { display: clicked ? 'none' : 'flex' }]}>
            <Notify
              id={album?.id}
              notified={
                data && data.podcasts && data.podcasts.indexOf(album?.id) > -1
              }
            />
          </View>
          <View style={{ display: clicked ? 'flex' : 'none' }}>
            <TextInput
              value={term}
              style={styles.textinput}
              placeholder={'  Enter search term'}
              onChangeText={setTerm}
            />
          </View>
          <View style={{ paddingLeft: 15 }}>
            <TouchableOpacity onPress={searchClicked}>
              <Ionicons
                name={clicked ? 'ios-close' : 'ios-search'}
                size={30}
                color="white"
                style={clicked ? styles.clicked : {}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 15 }}>
        <Autolink
          text={
            album?.description
              ? album?.description
                .replace(/(<\/?[^>]+(>|$))/g, '')
                .replace(/&nbsp;/g, ' ')
              : ''
          }
          numberOfLines={showAll ? 100 : 3}
          onTextLayout={useCallback(e => {
            setShowMore(e.nativeEvent.lines.length > 2);
          }, [])}
          linkStyle={{ color: 'white', opacity: 1, fontWeight: 'bold' }}
          style={{ color: '#999', lineHeight: 20 }}
        />
        {showMore ? (
          <TouchableOpacity onPress={() => setShowAll(!showAll)}>
            <Text
              style={{
                alignSelf: 'flex-end',
                color: 'white',
                paddingTop: 5,
                fontSize: 12,
              }}>
              {showAll ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {/* {props.showComments ? <CommentForm podcast_id={album?.id} /> : null} */}
    </View>
  );
};

export default AlbumHeader;
