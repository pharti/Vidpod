import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

type PlayerPlayButtonProps = {
  onPlayPausePress: () => void;
  isplaying: boolean;
};
const areEqual = (
  prevProps: PlayerPlayButtonProps,
  nextProps: PlayerPlayButtonProps,
) => {
  return prevProps.isplaying === nextProps.isplaying;
};
const PlayerPlayButton = (props: PlayerPlayButtonProps) => {
  const { onPlayPausePress, isplaying } = props;
  // const isplaying = useSelector(isplayingSelector);
  // const general = useSelector(generalSelector);
  return (
    <View style={styles.playArrows}>
      <TouchableOpacity onPress={onPlayPausePress}>
        <View style={styles.playRadius}>
          <Icon name={isplaying ? 'pause' : 'play'} size={20} color={'white'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default React.memo(PlayerPlayButton, areEqual);
