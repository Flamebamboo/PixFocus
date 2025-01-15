import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const SessionModal = (reset) => {
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.phaseText}>All Cycles Completed!</Text>
      <View>
        <Text>Time focused</Text>
      </View>
      <TouchableOpacity onPress={reset} style={styles.resetButton}>
        <Text style={styles.resetText}>Start New Session</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SessionModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    height: '50%',
    width: '80%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  phaseText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'PixelifySans',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PixelifySans',
  },
});
