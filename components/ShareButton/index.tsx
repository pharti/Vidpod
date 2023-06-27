import React from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import Icon from 'react-native-vector-icons/Entypo';

export type ShareButtonProps = {
  shareString: string;
  suffix: string;
  image_uri: string;
  title: string;
};
export default function ShareButton(props: ShareButtonProps) {
  const { shareString } = props;
  const buildLink = async (id: any) => {
    const link = await dynamicLinks().buildShortLink({
      link: 'https://yidpod.com/' + id,
      android: {
        packageName: 'com.yaschaffel.spotmobile',
      },
      ios: {
        appStoreId: '1544363632',
        bundleId: 'com.yaschaffel.spotmobile',
      },
      social: {
        title: props.title,
        imageUrl:
          'https://yidpod.com/wp-content/uploads/2020/12/YidPodsquare-2.jpg',
      },
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://share.yidpod.com',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      // analytics: {
      //   campaign: 'banner',
      // },
    });

    return link;
  };
  const onPress = async () => {
    try {
      const link = await buildLink(props.suffix);
      const result = await Share.share({
        title: '',
        message: shareString.replace('{link}', link),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Icon name="share" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginLeft: 10,
  },
});
