import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faCoins } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/utils/color';
import CustomSvg from './CustomSvg';

const CoinsInfoPopup = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <CustomSvg variant="coins" size={24} />
              <Text style={styles.title}>Coins Information</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={22} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>How to Earn Coins:</Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Base rate: 0.5 coins per second</Text>
              <Text style={styles.infoDetail}>(30 coins per minute / 1800 coins per hour)</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Completion bonus: 20% of base coins</Text>
            </View>

            <Text style={styles.sectionTitle}>Penalties:</Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoText}>• Failed sessions: Lose 50% of base coins</Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>Example:</Text>
              <Text style={styles.exampleText}>30 min session completed = 900 + 180 = 1080 coins</Text>
              <Text style={styles.exampleText}>30 min session failed = 900 - 450 = 450 coins</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeTextButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PixelCodeBold',
    color: '#000',
    marginLeft: 8,
  },
  closeButton: {
    padding: 5,
  },
  divider: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 12,
  },
  infoContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'PixelCodeBold',
    color: '#000',
    marginBottom: 10,
    marginTop: 15,
  },
  infoItem: {
    marginBottom: 10,
    paddingLeft: 5,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'PixelCodeMedium',
    color: '#000',
  },
  infoDetail: {
    fontSize: 13,
    fontFamily: 'PixelCode',
    color: '#00f',
    marginLeft: 12,
    marginTop: 2,
  },
  example: {
    marginTop: 10,
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  exampleTitle: {
    fontSize: 16,
    fontFamily: 'PixelCodeBold',
    color: COLORS.black,
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 14,
    fontFamily: 'PixelCodeMedium',
    color: COLORS.black,
    lineHeight: 22,
  },
  closeTextButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.secondaryYellow,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  closeText: {
    fontSize: 16,
    fontFamily: 'PixelCodeBold',
    color: COLORS.black,
  },
});

export default CoinsInfoPopup;
