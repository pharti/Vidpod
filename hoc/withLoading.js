import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const withLoading = (Comp) => ({ isLoading, children, ...props }) => {
  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={'grey'} />
      </View>
    );
  } else {
    return <Comp {...props}>{children}</Comp>;
  }
};

export default withLoading;
