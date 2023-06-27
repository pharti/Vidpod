import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useDispatch, useSelector } from 'react-redux';
import { statusSelector } from '../../../features/currentSongSlice';

import { onPlayPausePress } from '../../../database/functions';

type PlayerPlayButtonProps = {
  addCurrentTrack: () => void;
  episode_id: string;
  state: any;
};

const PlayerPlayButton = props => {
  // const isplaying = useSelector(isplayingSelector);
  // const general = useSelector(generalSelector);
  const status = useSelector(statusSelector);
  const dispatch = useDispatch();
  return (
    <View>
      <TouchableOpacity
        onPress={() => onPlayPausePress(status, props.id, dispatch)}>
        <View style={{ padding: 10 }}>
          {status == 'buffering' ? (
            <ActivityIndicator color={'white'} size={20} />
          ) : (
            <FontAwesome
              name={status == 'playing' ? 'pause' : 'play'}
              size={20}
              color={'white'}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
// const enhance = withObservables(['episode_id'], ({ episode_id, database }) => ({
//   episode: database.get('episodes').findAndObserve(episode_id),
// }));
// export default withDatabase(enhance(PlayerPlayButton));
export default PlayerPlayButton;
