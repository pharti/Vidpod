import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const colors = ['#1B2C58', '#27856A', '#509BF6', '#2D46BA', '#FF6436'];
export const PodcastCategory = ({ id, title, index }) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('CategoriesScreen', {
          id: id,
          name: title,
        });
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors[index % 5],
          },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 80,
    minWidth: 165,
    marginRight: 7,
    marginLeft: 7,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    paddingRight: 5,
    paddingLeft: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 18,
    //   maxWidth: 100,
    fontWeight: 'bold',
    //   padding: 10,
    //   letterSpacing: 1,
    paddingTop: 15,
    // paddingLeft: 10,
  },
});
