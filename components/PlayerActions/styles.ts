import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');
const maxWidth = 350;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButton: (status: string) => ({
    backgroundColor: 'white',
    height: 62,
    width: 62,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: status !== 'playing' && 4,
    borderRadius: 64,
  }),
});
export default styles;
