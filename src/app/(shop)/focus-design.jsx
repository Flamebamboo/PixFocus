/*
  The plan is to store all the design data in the appwrite database and then fetch it from focusItem.js
  and then display it here. The design data will be stored in the database as an array of objects

  For now im going to hard code the design data in the timerVariantStore and then later on
  I will fetch it from the database (focusItem.js) and display it here
  

  1) focus on the UX and UI of the shop 
  2) each design should show the name of the design and the image of the design
  3) the design should also have status of the design (if it is locked or unlocked)
  4) the design should have a price tag
  5) intergrate with db
*/
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlock, faLock, faCheck, faCoins } from '@fortawesome/free-solid-svg-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import useTimerVariant from '@/store/timerVariantStore';
import useCoinsStore from '@/store/coinsStore';

import { fetchDesigns } from '@/lib/focusItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import PressableScale from '@/components/PressableScale';
import COLORS from '@/utils/color';
import { toast } from 'sonner-native';
// Constants
const GRID_SPACING = {
  COLUMNS: 2,
  HORIZONTAL_PADDING: 20,
  ITEM_MARGIN: 10,
  ITEM_PADDING: 12,
};

const IMAGE_MAP = {
  1: require('assets/icons/CoffeeCupIcon.png'),
  2: require('assets/icons/FireCampIcon.png'),
  3: require('assets/icons/FireCampIcon.png'),
};

const FocusDesigns = () => {
  // Hooks and State
  const { width: screenWidth } = Dimensions.get('window');
  const {
    ownedItems,
    variant,
    purchaseItem,
    initialize,
    setVariant,
    isLoading: storeLoading,
    error: storeError,
  } = useTimerVariant();

  const { initializeCoins, coins: storeCoins, isLoading: coinsLoading } = useCoinsStore();

  // Remove the local coins state and use the store's coins directly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designItems, setDesignItems] = useState([]);
  const { user } = useGlobalContext();

  // Calculated dimensions
  const itemWidth = useMemo(() => {
    const availableWidth = screenWidth - GRID_SPACING.HORIZONTAL_PADDING;
    const totalMargins = GRID_SPACING.ITEM_MARGIN * (GRID_SPACING.COLUMNS * 2); // | 10px | Column 1 | 10px | 10px | Column 2 | 10px | 10px |
    return (availableWidth - totalMargins) / GRID_SPACING.COLUMNS;
  }, [screenWidth]);

  // Data fetching
  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true);
        await Promise.all([initializeCoins(user), initialize(user)]);
        const designs = await fetchDesigns();
        if (designs) setDesignItems(designs);
      } catch (err) {
        setError('Failed to load shop data. Please try again.');
        console.error('Shop loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [initialize, user, initializeCoins]);

  // Helper functions
  const getImagePath = useCallback((itemId) => {
    console.log('Item ID:', itemId);
    return IMAGE_MAP[itemId];
  }, []);

  const handlePurchase = useCallback(
    async (itemId, price) => {
      const success = await purchaseItem(itemId, user, price);
      if (!success) {
        // You might want to show an error message to the user
        toast.error('Purchase Failed', 'Not enough coins to purchase this item');
      }
    },
    [purchaseItem, user]
  );

  // Render functions
  const renderDesignItem = useCallback(
    ({ item }) => {
      const isOwned = ownedItems.includes(item.item_id);
      const isSelected = variant === item.variant;
      const imagePath = getImagePath(item.item_id);

      return (
        <PressableScale
          onPress={() => (isOwned ? setVariant(item.variant) : handlePurchase(item.item_id, item.price))}
          style={[styles.designItemContainer, { width: itemWidth }]}
          accessibilityLabel={`${isOwned ? 'Owned' : 'Locked'} design ${item.name}`}
        >
          <View style={[styles.imageContainer, { width: itemWidth - GRID_SPACING.ITEM_PADDING * 2 }]}>
            <Image
              source={imagePath}
              style={[styles.designImage, isSelected && styles.selectedImage]}
              contentFit="cover"
            />

            <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
              <FontAwesomeIcon
                icon={isOwned ? (isSelected ? faCheck : faUnlock) : faLock}
                size={16}
                color={isOwned ? (isSelected ? COLORS.success : COLORS.primary) : COLORS.error}
              />
            </View>
          </View>

          <View style={styles.designInfoContainer}>
            <Text style={styles.designName} numberOfLines={1}>
              {item.name}
            </Text>
            {!isOwned && <Text style={styles.designPrice}>{item.price}</Text>}
          </View>
        </PressableScale>
      );
    },
    [ownedItems, variant, setVariant, handlePurchase, user, itemWidth, getImagePath]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <PressableScale style={styles.exitButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000" />
        </PressableScale>
        <View className="flex-row justify-center w-full items-center py-6">
          <Text className="text-2xl font-PixelCodeBold text-black text-center justify-center items-center">
            Item Shop
          </Text>
          <View style={styles.coinsContainer}>
            <FontAwesomeIcon icon={faCoins} size={20} color={COLORS.orange} />
            <Text style={styles.coinsText}>{coinsLoading ? '...' : storeCoins}</Text>
          </View>
        </View>
      </View>
    ),
    [storeCoins, coinsLoading]
  );

  if (error || storeError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || storeError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <SafeAreaView edges={['top']}>{renderHeader()}</SafeAreaView>
      </View>
      <Animated.View style={styles.mainContent} entering={FadeIn.duration(1000)}>
        {loading || storeLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading items...</Text>
          </View>
        ) : (
          <Animated.FlatList
            entering={FadeInDown.duration(1000)}
            data={designItems}
            renderItem={renderDesignItem}
            keyExtractor={(item) => item.id}
            numColumns={GRID_SPACING.COLUMNS}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No designs available please report a bug</Text>
              </View>
            }
          />
        )}
      </Animated.View>
    </View>
  );
};

// Styles for the main wrapper and containers
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: COLORS.secondaryYellow,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.lightpink, // Changed from green to lightpink
  },
  centerContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 35,
    zIndex: 999,
    borderBottomWidth: 2,
  },
  gridContainer: {
    padding: GRID_SPACING.HORIZONTAL_PADDING,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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

  // Styles for design items
  designItemContainer: {
    marginBottom: GRID_SPACING.ITEM_MARGIN * 2,
    padding: GRID_SPACING.ITEM_PADDING,
    borderRadius: 12,
  },
  imageContainer: {
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  designImage: {
    width: '100%',
    height: '100%',
  },
  selectedImage: {
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 15,
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  selectedIconContainer: {
    backgroundColor: COLORS.orange,
  },
  designInfoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  designName: {
    fontSize: 18,
    fontFamily: 'ReadexProSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  designPrice: {
    fontSize: 18,
    fontFamily: 'PixelCodeBold',
    color: COLORS.purple,
  },

  // Styles for error and empty states
  errorText: {
    color: COLORS.orange,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'ReadexProBold',
  },
  emptyText: {
    color: COLORS.orange,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'ReadexProBold',
  },

  // Styles for loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightpink,
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'PixelCodeBold',
    color: '#000',
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

export default FocusDesigns;
