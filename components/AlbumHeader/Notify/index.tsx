import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNotifyPodcast,
  removeNotifyPodcast,
  userSelector,
} from '../../../features/userSlice';

export const Notify = ({ id, notified }) => {
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const bellClicked = () => {
    if (clicked) {
      dispatch(removeNotifyPodcast(id));
    } else {
      dispatch(addNotifyPodcast(id));
    }
    // await database.write(async () => {
    //   album.update(p => {
    //     p.notify = !p.notify;
    //   });
    // });
    setClicked(!clicked);
  };
  useEffect(() => {
    if (notified) {
      setClicked(true);
    }
  }, [notified]);
  return (
    <TouchableOpacity onPress={bellClicked}>
      <Image
        source={
          clicked
            ? require('../../../assets/images/bell-full.png')
            : require('../../../assets/images/bell-outline.png')
        }
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
};
