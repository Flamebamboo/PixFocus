import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import PressableScale from '../PressableScale';
import { Ionicons } from '@expo/vector-icons';
import CustomSvg from '../CustomSvg';
import useCoinsStore from '@/store/coinsStore';
import COLORS from '@/utils/color';
import { router } from 'expo-router';
import CoinsInfoPopup from '../CoinsInfoPopup';

const ShopHeader = () => {
  const { coins: storeCoins, isLoading: coinsLoading } = useCoinsStore();
  const [showCoinsInfo, setShowCoinsInfo] = useState(false);

  return (
    <View style={styles.headerContainer}>
      <PressableScale style={styles.exitButton} onPress={() => router.back()}>
        <Ionicons name="close" size={32} color="#000" />
      </PressableScale>
      <View className="flex-row justify-center w-full items-center py-6">
        <Text className="text-2xl font-PixelCodeBold text-black text-center justify-center items-center">
          Item Shop
        </Text>

        <TouchableOpacity style={styles.coinsContainer} onPress={() => setShowCoinsInfo(true)} activeOpacity={0.7}>
          <CustomSvg variant="coins" size={32} />
          <Text style={styles.coinsText}>{coinsLoading ? '...' : storeCoins}</Text>
        </TouchableOpacity>
      </View>

      <CoinsInfoPopup visible={showCoinsInfo} onClose={() => setShowCoinsInfo(false)} />
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

// For backward compatibility
const renderHeader = () => <ShopHeader />;

export default renderHeader;
