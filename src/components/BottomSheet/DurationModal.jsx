import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import CustomBackdrop from './CustomBackdrop';
import useTimerStore from '@/store/timerStore';

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_HOURS = createArray(6);
const AVAILABLE_MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString());

const DurationModal = ({ durationSheetRef, onClose }) => {
  const snapPoints = ['60%'];
  const duration = useTimerStore((state) => state.duration);
  const adjustDuration = useTimerStore((state) => state.setDuration);

  const initialHours = duration > 0 ? Math.floor(duration / 3600).toString() : '0';
  const initialMinutes = duration > 0 ? (Math.round((duration % 3600) / 300) * 5).toString() : '30';

  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);

  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    durationSheetRef.current?.present();
    setSelectedHours(initialHours);
    setSelectedMinutes(initialMinutes);
  }, [initialHours, initialMinutes]);

  const handleConfirm = () => {
    const totalSeconds = parseInt(selectedHours, 10) * 60 * 60 + parseInt(selectedMinutes, 10) * 60;
    adjustDuration(totalSeconds);
    durationSheetRef.current?.dismiss();
  };

  const renderPickers = () => (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedHours}
          onValueChange={(itemValue) => setSelectedHours(itemValue)}
          mode="dropdown"
        >
          {AVAILABLE_HOURS.map((value) => (
            <Picker.Item key={value} label={value} value={value} color="#FFFFFF" />
          ))}
        </Picker>
        <Text style={styles.pickerLabel}>hours</Text>
      </View>

      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedMinutes}
          onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
          mode="dropdown"
        >
          {AVAILABLE_MINUTES.map((value) => (
            <Picker.Item key={value} label={value} value={value} color="#FFFFFF" />
          ))}
        </Picker>
        <Text style={styles.pickerLabel}>minutes</Text>
      </View>
    </View>
  );

  return (
    <BottomSheetModal
      ref={durationSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.handleIndicator}
      android_keyboardInputMode="adjustResize"
      style={styles.modalStyle}
      backdropComponent={(props) => (
        <CustomBackdrop
          {...props}
          backgroundColor="#9482DA"
          opacity={1}

          //future pixel art animation image
        />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>Select Duration</Text>
        {renderPickers()}
        <Pressable
          className="w-1/2 mt-24 px-4 py-6 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          onPress={handleConfirm}
        >
          <Text className="text-black font-semibold text-lg">Done</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  modalBackground: {
    backgroundColor: '#141414',
  },
  handleIndicator: {
    backgroundColor: '#ffffff',
    width: 40,
  },
  modalStyle: {
    zIndex: 999,
    elevation: 999,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 10,
  },
  picker: {
    width: 100,
    height: 150,
  },
  pickerItem: {
    color: '#FFFFFF',
    fontSize: 25,
    flex: 1,
  },
  pickerLabel: {
    color: '#FFFFFF',
    fontSize: 16,

    fontWeight: '500',
  },
});

export default DurationModal;
