import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const SettingsButton = () => {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('SettingsScreen');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Icon name="menu" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};
export default SettingsButton;
