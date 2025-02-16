import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import PressableScale from '../PressableScale';
import { Ionicons } from '@expo/vector-icons';
import CustomSvg from '../CustomSvg';
import useCoinsStore from '@/store/coinsStore';
import COLORS from '@/utils/color';
import { router } from 'expo-router';

const renderHeader = () => {
  const { coins: storeCoins, isLoading: coinsLoading } = useCoinsStore();

  return (
    <View style={styles.headerContainer}>
      <PressableScale style={styles.exitButton} onPress={() => router.back()}>
        <Ionicons name="close" size={32} color="#000" />
      </PressableScale>
      <View className="flex-row justify-center w-full items-center py-6">
        <Text className="text-2xl font-PixelCodeBold text-black text-center justify-center items-center">
          Item Shop
        </Text>

        <View style={styles.coinsContainer}>
          <CustomSvg variant="coins" size={32} />
          <Text style={styles.coinsText}>{coinsLoading ? '...' : storeCoins}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 35,
    zIndex: 999,
    borderBottomWidth: 2,
  },
  exitButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 999,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: '#000',
    width: 40,
    height: 40,
  },
  coinsContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,

    borderWidth: 2,
    borderColor: COLORS.black,
  },
  coinsText: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'PixelCodeBold',
    color: COLORS.black,
  },
});

export default renderHeader;
