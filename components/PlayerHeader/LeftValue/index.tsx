import moment from 'moment';
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { positionSelector } from '../../../features/currentSongSlice';
import { convertMstoDuration } from '../../../js/time';

type LeftValueProps = {
  position: number;
};
export const LeftValue = () => {
  const position = useSelector(positionSelector);

  const leftValue = convertMstoDuration(position);

  return (
    <Text style={{ color: 'white', opacity: 0.7, fontSize: 12 }}>
      {leftValue}
    </Text>
  );
};
