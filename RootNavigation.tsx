import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function where() {
  if (navigationRef.isReady()) {
    return navigationRef?.getCurrentRoute().name;
  }
}