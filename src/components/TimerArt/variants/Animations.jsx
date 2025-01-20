import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

const Animations = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../../assets/gif/firecamp.gif')}
        contentFit="contain"
        transition={1000}
        onError={(error) => console.log('Image loading error:', error)} // Add this for debugging
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Animations;
