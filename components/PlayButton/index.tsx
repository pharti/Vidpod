import React from 'react';
import { Text, View } from 'react-native';

// import {episode} from '../../types'
import styles from './styles';

export const PlayButton = (props: any) => {
  const { isPlaying } = props;
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.button}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
    </View>
  );
};
