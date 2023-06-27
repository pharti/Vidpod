import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export const Comment = props => {
  console.log(props);
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>{props.message}</Text>
      </View>
      <View style={styles.topContainer}>
        <Text style={styles.bottomText}>{props.created_at}</Text>
      </View>
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: { paddingLeft: 10 },
  topText: { color: 'white', fontSize: 14 },
  topContainer: {
    paddingBottom: 10,
  },
  bottomText: { color: 'white', opacity: 0.7, fontSize: 12 },
});
