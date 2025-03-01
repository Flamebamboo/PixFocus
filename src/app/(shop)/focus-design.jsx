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
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlock, faLock, faCheck, faCoins } from '@fortawesome/free-solid-svg-icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import Animated, { LinearTransition } from 'react-native-reanimated';

import useTimerVariant from '@/store/timerVariantStore';
import useCoinsStore from '@/store/coinsStore';

import { fetchDesigns } from '@/lib/focusItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import PressableScale from '@/components/PressableScale';
import COLORS from '@/utils/color';
import { toast } from 'sonner-native';

import SegmentadControl from '@/components/SegmentadControl';
import ItemDisplay from '@/components/BottomSheet/Modals/ItemDisplay';
import CustomSvg from '@/components/CustomSvg';
import renderHeader from '@/components/Shop/ShopHeader';

// Constants
const GRID_SPACING = {
  COLUMNS: 2,
  HORIZONTAL_PADDING: 20,
  ITEM_MARGIN: 10,
  ITEM_PADDING: 12,
};

const IMAGE_MAP = {
  1: require('assets/icons/coffeecup-icon.gif'),
  2: require('assets/icons/firecamp-icon.gif'),
  3: require('assets/icons/owl-icon.gif'),
  4: require('assets/icons/rabbit-icon.gif'),
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

  const { initializeCoins } = useCoinsStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designItems, setDesignItems] = useState([]);
  const { user } = useGlobalContext();
  const [itemDisplayVisible, setItemDisplayVisible] = useState(null);

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
        toast.error('Purchase Failed');
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
        // <PressableScale
        //   onPress={() => (isOwned ? setVariant(item.variant) : handlePurchase(item.item_id, item.price))}
        //   style={[styles.designItemContainer, { width: itemWidth }]}
        //   accessibilityLabel={`${isOwned ? 'Owned' : 'Locked'} design ${item.name}`}
        // >
        <PressableScale
          onPress={() => {
            setItemDisplayVisible({
              item: {
                name: item.name,
                price: item.price,
                image: getImagePath(item.item_id),
                item_id: item.item_id,
                variant: item.variant,
              },
              isOwned: isOwned,
            });
          }}
          style={[styles.designItemContainer, { width: itemWidth }]}
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
          </View>
        </PressableScale>
      );
    },
    [ownedItems, variant, setVariant, handlePurchase, user, itemWidth, getImagePath]
  );

  //error handling
  if (error) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <SafeAreaView edges={['top']}>{renderHeader()}</SafeAreaView>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <SafeAreaView edges={['top']}>{renderHeader()}</SafeAreaView>
      </View>
      <View style={styles.mainContent}>
        {loading || storeLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading items...</Text>
          </View>
        ) : (
          <Animated.FlatList
            data={designItems}
            renderItem={renderDesignItem}
            keyExtractor={(item) => item.item_id}
            numColumns={GRID_SPACING.COLUMNS}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No designs available please report a bug</Text>
              </View>
            }
            itemLayoutAnimation={LinearTransition}
          />
        )}
      </View>
      <ItemDisplay
        visible={!!itemDisplayVisible}
        onClose={() => setItemDisplayVisible(null)}
        item={itemDisplayVisible?.item}
        isOwned={itemDisplayVisible?.isOwned}
        onPurchase={(id, price) => handlePurchase(id, price)}
        setVariant={(variant) => setVariant(variant)}
      />
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

  gridContainer: {
    padding: GRID_SPACING.HORIZONTAL_PADDING,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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
    padding: 8,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedIconContainer: {
    backgroundColor: COLORS.green,
  },
  designInfoContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  designName: {
    fontSize: 18,
    fontFamily: 'PixelCodeMedium',
    color: '#000',
    marginBottom: 4,
  },

  // Styles for error and empty states
  errorText: {
    color: COLORS.orange,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'PixelCodeMedium',
  },
  emptyText: {
    color: COLORS.orange,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'PixelCodeMedium',
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
});

export default FocusDesigns;
