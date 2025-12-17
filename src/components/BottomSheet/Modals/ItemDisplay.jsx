import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlock, faLock, faX } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/utils/color';
import { BlurView } from '@react-native-community/blur';
import CustomSvg from '@/components/CustomSvg';
import useTimerVariant from '@/store/timerVariantStore';
import { moderateScale, isTablet } from '@/utils/responsive';

const { width, height } = Dimensions.get('window');
const ItemDisplay = ({ visible, onClose, item, isOwned, onPurchase, setVariant }) => {
  const currentVariant = useTimerVariant((state) => state.variant);
  const isCurrentlyEquipped = item?.variant === currentVariant;

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={3} />
        {visible && (
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.imageContainer}>
              <Image source={item?.image} style={styles.image} contentFit="cover" />
              <View style={styles.iconContainer}>
                <FontAwesomeIcon icon={isOwned ? faUnlock : faLock} size={20} color={'black'} />
              </View>
            </View>

            <Text style={styles.title}>{item?.name}</Text>

            {isOwned ? (
              <TouchableOpacity
                style={[styles.button, isCurrentlyEquipped && styles.equippedButton]}
                onPress={() => {
                  if (!isCurrentlyEquipped) {
                    setVariant(item.variant);
                    onClose();
                  }
                }}
                disabled={isCurrentlyEquipped}
              >
                <Text style={styles.buttonText}>{isCurrentlyEquipped ? 'Equipped' : 'Equip'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onPurchase(item.item_id, item.price);
                  onClose();
                }}
              >
                <CustomSvg variant="coins" size={40} />
                <Text style={styles.buttonText}>{item?.price}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.exit} onPress={onClose}>
              <FontAwesomeIcon icon={faX} size={16} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Modal>
  );
};

export default ItemDisplay;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: isTablet() ? '70%' : width,
    maxWidth: isTablet() ? 500 : undefined,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: isTablet() ? moderateScale(300) : '75%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: isTablet() ? moderateScale(20) : 20,
    fontFamily: 'PixelCode',
    color: '#fff',
    marginBottom: isTablet() ? moderateScale(30) : 50,
  },
  button: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkPurple,
    width: isTablet() ? moderateScale(200) : '50%',
    height: isTablet() ? moderateScale(60) : '12%',
    borderRadius: 20,
  },
  equippedButton: {
    backgroundColor: COLORS.orange,
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PixelCode',
  },
  exit: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 999,
    position: isTablet() ? 'relative' : 'absolute',
    top: isTablet() ? undefined : 500,
    marginTop: isTablet() ? moderateScale(40) : 0,
    borderWidth: 1,
    borderColor: 'white',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
