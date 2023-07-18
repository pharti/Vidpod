import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  image: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 5,
  },
  podcastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 36,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 23,
    textAlign: 'left',
  },
  author: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'left',
  },
  creatorContainer: {
    flexDirection: 'row',
    margin: 5,
  },
  slider: {
    width: width - 48,
    height: 16,
    flexShrink: 1,
    paddingTop: 20,
    zIndex: 10,
    backgroundColor: '#242424',
  },
  text: {
    color: 'white',
    opacity: 0.7,
  },
  by: {
    margin: 5,
    color: 'lightgray',
    fontSize: 20,
  },
  likes: {
    margin: 5,
    color: 'lightgray',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#1DB954',
    height: 50,
    width: 150,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'lightgray',
    fontSize: 20,
  },
});
export default styles;
