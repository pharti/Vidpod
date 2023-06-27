import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../features/generalSlice';

export const FilterButton = (props: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    props.type && props.type == 'downloaded' ? 1 : 0,
  );
  const [textHeight, setTextHeight] = useState(0);
  const items = ['All Episodes', 'Downloaded'];
  const values = ['all', 'downloaded'];
  const dispatch = useDispatch();
  const onLayout = event => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
  };
  useEffect(() => {
    setValue(
      (props.type && props.type == 'downloaded') || props.type == 'new' ? 1 : 0,
    );
  }, [props.type]);

  return (
    <View style={styles.container}>
      <View style={{ marginRight: 10 }}>
        <View style={{ backgroundColor: '#232323' }}>
          <TouchableWithoutFeedback
            onPress={() => setOpen(!open)}
            style={{
              flexDirection: 'row',
              backgroundColor: '#232323',
              // borderRadius: 10,
            }}>
            <View style={styles.textContainer} onLayout={onLayout}>
              <Text
                style={{
                  padding: 10,

                  backgroundColor: '#232323',
                  color: props.type == 'new' ? '#1DB954' : 'grey',
                }}>
                {items[value]}
              </Text>
              <View
                style={props.type == 'new' ? styles.downloaded : null}></View>
            </View>
            <FontAwesome5
              name={'angle-down'}
              size={20}
              color={'grey'}
              style={{
                backgroundColor: '#232323',
                alignSelf: 'center',
                paddingRight: 10,
              }}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            display: open ? 'flex' : 'none',
            position: 'absolute',
            top: textHeight,
            width: '100%',
          }}>
          {items.map((item, index) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setValue(index), setOpen(!open);
                dispatch(setFilter(values[index]));
              }}
              key={index + 'hello'}>
              <Text
                style={{
                  padding: 10,
                  color: 'grey',
                  backgroundColor: '#232323',
                }}>
                {item}
              </Text>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>

      <FontAwesome5
        name="filter"
        size={20}
        color={'white'}
        style={{ width: 20, marginTop: 10 }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // width: '100%',
    // height: '100%',
    // position: 'absolute',
    // zIndex: 3000,
    // elevation: 10000,
    // top: -20,
    // right: 0,

    // justifyContent: 'flex-start',
    // position: 'absolute',
    // flex: 1,
    // height: 500,
    // width: 150,
    // width: 500,
    // backgroundColor: 'red',
    // width: 200,
  },
  dropdown: {
    // backgroundColor: 'yellow',
    paddingRight: 5,
  },
  downloaded: {
    width: 5,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#1DB954',
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: 15,
  },
});
