import React from 'react';
import { Linking, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Yidpod from '../../assets/images/YidPodcolor.svg';
export const DonateScreen = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <View>
        <Yidpod />
      </View>
      <View>
        <Text
          style={{
            color: 'white',
            padding: 20,
            fontSize: 18,
            // backgroundColor: 'red',
          }}>
          YidPod relies on the generous support of our listeners to continue
          building and optimizing this app.
        </Text>
        <Text
          style={{
            color: 'white',
            padding: 20,
            fontSize: 18,
            // backgroundColor: 'red',
          }}>
          Please consider contributing today and become a partner in our vision
          of sharing Torah podcasts and inspiration with Jews around the globe.
        </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://thechesedfund.com/yidpod/helpusgrow');
          }}
          style={{
            backgroundColor: '#1DB954',
            paddingRight: 25,
            paddingLeft: 25,
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 10,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Icon name="dollar" color="#F1F1F1" size={18} />
          <Text
            style={{
              paddingLeft: 6,
              color: '#F1F1F1',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Support YidPod
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
