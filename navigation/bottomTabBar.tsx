import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useDatabase } from '@nozbe/watermelondb/hooks';
import { firebase } from '@react-native-firebase/messaging';
import PlayerWidget from '../components/PlayerWidget/newindex';
import { toastSelector } from '../features/generalSlice';

export default function MyTabBar(props: any) {
  const { descriptors, state, navigation, style, tabStyle } = props;
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const showToast = useSelector(toastSelector);
  const database = useDatabase();
  // const currentSong = useSelector(currentSongSelector);
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  const handleDynamicLink = async (link: any) => {
    // Handle dynamic link inside your own application
    if (link && link.url) {
      const getQuery = link.url
        .replace('https://yidpod.com/', '')
        .replace('https://share.yidpod.com/', '')
        .split('/');
      const podcast_id = getQuery[0];

      if (getQuery.length == 1) {
        fetch(
          'https://yidpod.com/wp-json/wp/v2/podcasts?include[]=' + podcast_id,
        )
          .then(r => {
            return r.json();
          })
          .then(podcasts => {
            const podcast = podcasts[0];
            navigation.push('AlbumScreen', {
              id: podcast_id,
              name: podcast.title,
              feedlink: podcast.feedlink,
              title: podcast.title,
              imageUri: podcast.image_uri,
              album: podcast,
              type: podcast.type,
              author: podcast.author,
              subscribed: podcast.subscribed,
              audiobook: podcast.type && podcast.type.indexOf('audiobook') > -1,
              email: podcast.email,
            });
          })
          .catch(error => {
            // navigation.push('AlbumScreen', {
            //   id: podcast_id,
            //   name: '',
            // });
          });
      }
      if (getQuery.length == 2) {
        const id = getQuery[1];
        database
          .get('episodes')
          .find('e' + id.replace('e', ''))
          .then(episode => {
            navigation.push('EpisodeScreen', {
              id: id,
              podcast_id: podcast_id,
              name: episode.title,
            });
          })
          .catch(error => {
            navigation.push('EpisodeScreen', {
              id: id,
              podcast_id: podcast_id,
              name: '',
            });
          });
      }
    }
    // if (link.url === 'https://yidpod.com/') {
    //   // ...navigate to your offers screen
    // }
  };

  React.useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        if (link && link.url) {
          const getQuery = link.url
            .replace('https://yidpod.com/', '')
            .replace('https://share.yidpod.com/', '')
            .split('/');
          const podcast_id = getQuery[0];
          if (getQuery.length == 1) {
            fetch(
              'https://yidpod.com/wp-json/wp/v2/podcasts?include[]=' +
                podcast_id,
            )
              .then(r => {
                return r.json();
              })
              .then(podcasts => {
                const podcast = podcasts[0];
                navigation.push('AlbumScreen', {
                  id: podcast_id,
                  name: podcast.title,
                  feedlink: podcast.feedlink,
                  title: podcast.title,
                  imageUri: podcast.image_uri,
                  album: podcast,
                  type: podcast.type,
                  author: podcast.author,
                  subscribed: podcast.subscribed,
                  audiobook:
                    podcast.type && podcast.type.indexOf('audiobook') > -1,
                  email: podcast.email,
                });
              })
              .catch(error => {
                // navigation.push('AlbumScreen', {
                //   id: podcast_id,
                //   name: '',
                // });
              });
          }
          if (getQuery.length == 2) {
            const id = getQuery[1];
            database
              .get('episodes')
              .find('e' + id.replace('e', ''))
              .then(episode => {
                navigation.push('EpisodeScreen', {
                  id: id,
                  podcast_id: podcast_id,
                  name: episode.title,
                });
              })
              .catch(error => {
                navigation.push('EpisodeScreen', {
                  id: id,
                  podcast_id: podcast_id,
                  name: '',
                });
              });
          }
        }
      });
    firebase.messaging().onNotificationOpenedApp(message => {
      const episode_id = message.data?.episode_id;
      const podcast_id = message.data?.podcast_id;
      const title = message.data?.title;

      if (episode_id && podcast_id) {
        navigation.push('EpisodeScreen', {
          id: episode_id,
          podcast_id: podcast_id,
          name: title,
        });
      }
    });
    firebase
      .messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          const episode_id = message.data?.episode_id;
          const podcast_id = message.data?.podcast_id;
          const title = message.data?.title;

          if (episode_id && podcast_id) {
            navigation.push('EpisodeScreen', {
              id: episode_id,
              podcast_id: podcast_id,
              name: title,
            });
          }
        }
      });
    firebase
      .messaging()
      .subscribeToTopic('new_episode')
      .then(() => {});
    firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('Message handled in the background!', remoteMessage);
    });
    return () => {
      firebase.messaging().unsubscribeFromTopic('new_episode');
    };
  }, []);

  return (
    <View>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: 60,
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          display: showToast ? 'flex' : 'none',
        }}>
        <Text style={{ fontWeight: 'bold' }}>{showToast}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MyFeed', {
              params: {
                to: 'new',

                date: new Date().getTime(),
              },
              screen: 'FeedScreen',
            });
          }}>
          <Text>View</Text>
        </TouchableOpacity>
      </View>
      <PlayerWidget />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1C1E22',
          alignItems: 'center',
          justifyContent: 'space-between',
          // width: '100%',
          paddingTop: 5,
          paddingBottom: tabStyle.paddingBottom,
          // flex: 1,
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View
              key={route.key}
              style={{
                backgroundColor: '#1C1E22',
                flex: 1,
              }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                // containerStyle={{ backgroundColor: 'yellow', flex: 1 }}
                onLongPress={onLongPress}
                key={route.key}>
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {options.tabBarIcon({
                    color: isFocused
                      ? props.activeTintColor
                      : 'rgba(255,255,255,.3)',
                  })}
                  <Text
                    style={{
                      //   opacity: isFocused ? 1 : 0.3,
                      // flex: 1,
                      // textAlign: 'center',
                      paddingTop: 5,
                      fontSize: 12,
                      // backgroundColor: 'red',
                      color: isFocused
                        ? props.activeTintColor
                        : 'rgba(255,255,255,.3)',
                    }}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
