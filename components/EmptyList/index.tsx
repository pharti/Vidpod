import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export type EmptyListProps = {
  messageString: string;
};

export default function EmptyList(props: EmptyListProps) {
  const { messageString } = props;
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('HomeScreen');
      }}
    >
      <View style={styles.container}>
        <Text style={styles.message}>{messageString}</Text>
        <View style={styles.browseContainer}>
          <Text style={styles.browse}>Browse Podcasts</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  message: { fontSize: 20, color: 'white', textAlign: 'center' },
  browseContainer: {
    marginTop: 20,
    borderColor: 'white',
    borderRadius: 20,
  },
  browse: {
    fontSize: 18,
    color: 'white',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#1DB954',
    fontWeight: 'bold',
    margin: 5,
    padding: 20,

    // border

    // overflow: 'hidden',
  },
});
