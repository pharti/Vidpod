import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RenderHTML from 'react-native-render-html';

const Ad = props => {
  const [html, setHTML] = useState('');
  const bust = Math.floor(89999999 * Math.random() + 10000000);
  const referer = 'yidpod';
  const dim = Dimensions.get('screen');
  const navigation = useNavigation();
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('fc');
  //     if (!props.refreshing) {
  //       setMillis(new Date().getTime());
  //     }
  //   }, []),
  // );
  useEffect(() => {
    if (props.refreshing) {
      fetch(
        'https://servedby.jewishcontentnetwork.com/servlet/view/banner/javascript/html/zone?zid=61&pid=0&resolution=' +
          300 +
          'x' +
          250 +
          '&random=' +
          bust +
          '&millis=' +
          new Date().getTime() +
          '&referrer=' +
          referer,
      ).then(async res => {
        const text = await res.text();

        setHTML(text);
      });
    }
  }, [props.refreshing]);

  return (
    <>
      {/* <View
        style={{ width: 300, height: 250, display: rendered ? 'none' : 'flex' }}
      /> */}
      <View>
        <Text style={styles.adText}>Advertisement</Text>
        <RenderHTML contentWidth={300} source={{ html }} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ContactUsScreen', { type: 'ad' });
          }}>
          <Text style={styles.adLink}>Click to advertise here</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
function areEqual(prevProps, nextProps) {
  return nextProps.refreshing == prevProps.refreshing;
}
const styles = StyleSheet.create({
  adText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },

  adLink: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
});
export default memo(Ad, areEqual);
