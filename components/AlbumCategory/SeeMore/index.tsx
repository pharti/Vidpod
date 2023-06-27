import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

export const SeeMore = (props: {
  text: string;
  navParams: {
    id: string | number;
    term: undefined | string;
    terms: undefined | string;
    name: string;
  };

  screen: string;
  navigation: any;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate(props.screen, { ...props.navParams });
      }}>
      <View style={styles.container}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};
const squareSize = 150;
const { width } = Dimensions.get('window');
const fourthWidth = (width - 80) / 2;
const styles = StyleSheet.create({
  container: {
    borderColor: 'white',
    borderWidth: 1,
    width: fourthWidth > squareSize ? squareSize : fourthWidth,
    height: fourthWidth > squareSize ? squareSize : fourthWidth,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    // padding: 10,
    textAlign: 'center',
    lineHeight: 20,
    width: fourthWidth > squareSize ? 100 : fourthWidth - 50,
  },
});
