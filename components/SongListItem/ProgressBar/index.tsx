import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React from 'react';
import { View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  currentSongSelector,
  positionSelector,
  statusSelector,
} from '../../../features/currentSongSlice';
import { catchError, concatMap } from 'rxjs/operators';
import { convertDurationtoMs } from '../../../js/time';

const ProgressBar = ({ id, progressBar, duration, song, status }) => {
  // const currentSong = useSelector(currentSongSelector);

  const position = useSelector(positionSelector);
  const getProgress = (duration: string) => {
    const p = status == 'playing' ? position : song.position;

    if (p > 0) {
      const newduration =
        duration.indexOf(':') > -1 ? convertDurationtoMs(duration) : duration;
      return Math.round((p / newduration) * 100);
    } else {
      return 1;
    }
  };
  const currentProgress = getProgress(duration);
  // const opaque = currentProgress > 99 ? 0.5 : 1;
  const showGreen = currentProgress > 1 ? 'flex' : 'none';
  return (
    <View
      style={{
        // justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
      }}>
      <View
        style={[
          progressBar,

          { display: showGreen },
          { width: `${currentProgress}%` },
        ]}
      />
      <View
        style={[
          {
            height: 2,
            // alignSelf: 'flex-end',
            backgroundColor: '#3e3e3e',
          },
          { width: `${100 - currentProgress}%` },
        ]}
      />
    </View>
  );
};
const enhance = withObservables(['id', 'status'], ({ id, database }) => ({
  song: database
    .get('episodes')
    .findAndObserve('e' + id.replace('e', ''))
    .pipe(
      catchError(async err => {
        return { position: 0 };
      }),
    ),
}));
export default withDatabase(enhance(ProgressBar));
