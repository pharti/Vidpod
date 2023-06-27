// functions-file.js
import { Dimensions, Platform, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 30,
});

const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};
function tabBarHeight() {
  const majorVersion = parseInt(Platform.Version, 10);
  const isIos = Platform.OS === 'ios';
  const isIOS11 = majorVersion >= 11 && isIos;
  if(Platform.isPad) return 49;
  if(isIOS11 && !isLandscape()) return 49;
  return 29;
}
export const tabHeight = tabBarHeight();
