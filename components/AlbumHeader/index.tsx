import { useDatabase } from '@nozbe/watermelondb/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import Autolink from 'react-native-autolink';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import {
  addNotifyPodcast,
  removeNotifyPodcast,
  sendSubscribe,
  sendUnsubscribe,
  userSelector,
} from '../../features/userSlice';

import ShareButton from '../ShareButton';

// import {Album} from '../../types'
import styles from './styles';

export type AlbumHeaderProps = {
  album: any;
  termChanged: any;
};

const AlbumHeader = (props: AlbumHeaderProps) => {
  const { album } = props;
  const dispatch = useDispatch();
  const database = useDatabase();
  const user = useSelector(userSelector);
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [term, setTerm] = useState('');

  const [clicked, setClicked] = useState(false);
  // const podcast = useSelector((state) => selectById(state, album.id));
  const onPress = async () => {
    // return;
    if (album) {
      if (album.subscribed > 0) {
        dispatch(sendUnsubscribe(album.id));
        await album.unsubscribe();
      } else {
        dispatch(sendSubscribe(album.id));
        await album.subscribe();
      }
    }
  };
  const bellClicked = async () => {
    if (album.notify) {
      dispatch(removeNotifyPodcast(album.id));
    } else {
      dispatch(addNotifyPodcast(album.id));
    }
    await database.write(async () => {
      album.update(p => {
        p.notify = !p.notify;
      });
    });
  };
  const searchClicked = () => {
    if (clicked) {
      setTerm('');
    }
    setClicked(!clicked);
  };
  useEffect(() => {
    props.termChanged(term);
  }, [term]);
  if (!album) {
    return null;
  }
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
              fontSize:
                album?.title.length < 20
                  ? 26
                  : album?.title.length > 35
                  ? 20
                  : 22,
            }}>
            {decodeURI(album?.title)}
          </Text>
          <Text style={styles.author}>{decodeURI(album?.author)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={onPress}
          // style={{ justifyContent: 'flex-start' }}
        >
          <View
            style={[styles.button, { display: clicked ? 'none' : 'flex' }, ,]}>
            <Text style={styles.buttonText}>
              {album.subscribed == 0 ? 'Subscribe' : 'Unsubscribe'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.rightContainer]}>
          <View
            style={[
              styles.shareButton,
              { display: clicked ? 'none' : 'flex' },
            ]}>
            <ShareButton
              shareString={`I'm listening to ${album?.title} on YidPod. Check it out at {link}`}
              suffix={album?.id}
              title={album?.title}
            />
          </View>
          <View
            style={[styles.bellButton, { display: clicked ? 'none' : 'flex' }]}>
            <TouchableOpacity onPress={bellClicked}>
              <Image
                source={
                  album.notify
                    ? require('../../assets/images/bell-full.png')
                    : require('../../assets/images/bell-outline.png')
                }
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
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
    </View>
  );
};

export default AlbumHeader;
