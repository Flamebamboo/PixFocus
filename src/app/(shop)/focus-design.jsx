import { View, Text, FlatList, Image, Dimensions, Touchable, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { faUnlock, faLock, faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useTimerVariant from '@/store/timerVariantStore';

import { fetchDesigns } from '@/lib/focusItem';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

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

const focusDesigns = () => {
  const { width } = Dimensions.get('window');
  const itemWidth = width / 2 - 20;
  const { ownedItems, variant, purchaseItem, initialize, setVariant, isLoading, error } = useTimerVariant();
  const [designItems, setDesignItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();

  useEffect(() => {
    const loadShop = async () => {
      try {
        setLoading(true);
        await initialize(user);
        const designs = await fetchDesigns();
        if (designs) setDesignItems(designs);
      } catch (error) {
        console.error(`shop load issue`, error);
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [user]);

  const getImagePath = (itemId) => {
    switch (itemId) {
      case '1':
        return require('assets/images/icon.png');
      case '2':
        return require('assets/images/icon.png');
      case '3':
        return require('assets/images/icon.png');
      // Add more cases as needed
      default:
        return require('assets/images/icon.png');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-custom-black">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const renderDesigns = ({ item }) => {
    const isOwned = ownedItems.includes(item.item_id); //item.item_id is correct lmao
    const isSelected = variant === item.variant;
    const imagePath = getImagePath(item.id); // get img path based on the item ID with switch cases

    return (
      <TouchableOpacity
        onPress={() => (isOwned ? setVariant(item.variant) : purchaseItem(item.item_id, user))}
        className="m-2"
      >
        <View className="flex items-center justify-center relative" style={{ width: itemWidth }}>
          {isSelected ? (
            <Image
              className="rounded-xl border-red-500 border-4"
              source={imagePath}
              style={{ width: itemWidth - 20, height: itemWidth - 20, resizeMode: 'contain' }}
            />
          ) : (
            <Image
              className="rounded-xl"
              source={imagePath}
              style={{ width: itemWidth - 20, height: itemWidth - 20, resizeMode: 'contain' }}
            />
          )}
          <View className="absolute top-1 right-3 m-2">
            {isOwned ? (
              isSelected ? (
                <FontAwesomeIcon icon={faCheck} size={16} color="white" />
              ) : (
                <FontAwesomeIcon icon={faUnlock} size={16} color="white" />
              )
            ) : (
              <View>
                <FontAwesomeIcon icon={faLock} size={16} color="white" />
              </View>
            )}
          </View>
          <Text className={'text-xl text-white'}>{item.name}</Text>

          {!isOwned && (
            <View>
              <Text className={'text-md font-semibold text-white'}>{item.price}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black relative">
      <View className="flex-row items-center px-4 py-6">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-2xl font-bold text-white text-center mr-8">Focus Designs</Text>
      </View>

      <FlatList
        data={designItems}
        renderItem={renderDesigns}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          padding: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default focusDesigns;
