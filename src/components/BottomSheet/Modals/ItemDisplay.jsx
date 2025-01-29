import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlock, faLock, faX } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/utils/color';
import { BlurView } from '@react-native-community/blur';
import CustomSvg from '@/components/CustomSvg';
import useTimerVariant from '@/store/timerVariantStore';

const { width, height } = Dimensions.get('window');
const ItemDisplay = ({ visible, onClose, item, isOwned, onPurchase, setVariant }) => {
  const currentVariant = useTimerVariant((state) => state.variant);
  const isCurrentlyEquipped = item?.variant === currentVariant;

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent animationType="fade">
      <BlurView style={styles.modalOverlay} blurType="dark" blurAmount={3}>
        {visible && (
          <View style={styles.modalContent}>
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
                onPress={() => setVariant(item.variant)}
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
          </View>
        )}
      </BlurView>
    </Modal>
  );
};

export default ItemDisplay;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '75%',
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
    fontSize: 20,
    fontFamily: 'PixelCode',
    color: '#fff',
    marginBottom: 50,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkPurple,
    width: '50%',
    height: '12%',
    borderRadius: 20,
  },
  equippedButton: {
    backgroundColor: COLORS.orange,
  },
  buttonText: {
    color: '#fff',
    fontSize: 38,
    fontFamily: 'M5x7',
  },
  exit: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 999,
    position: 'absolute',
    top: 500,
    borderWidth: 1,
    borderColor: 'white',
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
