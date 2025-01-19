import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import CustomBackdrop from "./CustomBackdrop";
import useTimerStore from "@/store/timerStore";
import COLORS from "@/utils/color";
import StartButton from "../StartButton";
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from "react-native-reanimated";

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_MINUTES = Array.from({ length: 25 }, (_, i) => (i * 5).toString());

const ITEM_WIDTH = 100;
const ITEM_MARGIN = 8;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;

const DurationModal = ({ durationSheetRef, onClose }) => {
  const snapPoints = ["60%"];
  const duration = useTimerStore((state) => state.duration);
  const adjustDuration = useTimerStore((state) => state.setDuration);

  const initialMinutes = duration > 0 ? (Math.round((duration % 3600) / 300) * 5).toString() : "30";

  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const windowWidth = Dimensions.get("window").width;
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const scrollViewRef = useRef(null);

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
    setSelectedMinutes(initialMinutes);
  }, [initialMinutes]);

  useEffect(() => {
    const initialIndex = AVAILABLE_MINUTES.indexOf(selectedMinutes);
    const scrollToX = initialIndex * TOTAL_ITEM_WIDTH;

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: scrollToX, animated: true });
    }, 100);
  }, []);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const selectedIndex = Math.round(offsetX / TOTAL_ITEM_WIDTH);

    if (selectedIndex >= 0 && selectedIndex < AVAILABLE_MINUTES.length) {
      setSelectedMinutes(AVAILABLE_MINUTES[selectedIndex]);
    }
  };

  const handleConfirm = () => {
    const totalSeconds = parseInt(selectedMinutes, 10) * 60;
    adjustDuration(totalSeconds);
    durationSheetRef.current?.dismiss();
  };

  const renderPickers = () => (
    <View style={styles.pickerOuterContainer}>
      <View style={styles.centerIndicator}>
        <View style={styles.circle}>
          <View style={styles.innerCircle} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: windowWidth / 2 - TOTAL_ITEM_WIDTH / 2 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={TOTAL_ITEM_WIDTH}
        decelerationRate="fast"
        onLayout={(event) => setScrollViewWidth(event.nativeEvent.layout.width)}
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Pressable key={value} style={[styles.minuteItem, selectedMinutes === value && styles.selectedMinuteItem]}>
            <Text style={[styles.minuteText, selectedMinutes === value && styles.selectedMinuteText]}>{value}</Text>
            <Text style={[styles.minuteLabel, selectedMinutes === value && styles.selectedMinuteText]}>min</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <BottomSheetModal
      ref={durationSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backgroundStyle={styles.modalBackground}
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ display: "none" }}
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
        <View className="w-full flex justify-center items-center pt-32">
          <StartButton text="Done" onPress={handleConfirm} />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 24,
  },
  modalBackground: {
    backgroundColor: COLORS.lightpink,
  },

  modalStyle: {
    zIndex: 999,
    elevation: 999,
  },
  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "PixelCodeBold",
  },
  pickerOuterContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  centerIndicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    width: TOTAL_ITEM_WIDTH,
    height: "100%",
    transform: [{ translateX: -TOTAL_ITEM_WIDTH / 2 }],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    pointerEvents: "none",
  },
  circle: {
    position: "absolute",
    top: "100%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.orange + "40",
    transform: [{ translateY: -12 }],
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.orange,
  },
  pickerContainer: {
    width: "100%",
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: Dimensions.get("window").width / 2 - TOTAL_ITEM_WIDTH / 2,
    alignItems: "center",
  },
  minuteItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMinuteItem: {
    backgroundColor: COLORS.orange,
    borderWidth: 4,
    borderColor: "#000",
  },
  minuteText: {
    fontSize: 24,
    fontFamily: "PixelCode",
    color: "#000",
  },
  minuteLabel: {
    fontSize: 14,
    fontFamily: "PixelCode",
    color: "#000",
    marginTop: 4,
  },
  selectedMinuteText: {
    color: COLORS.secondaryYellow,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: 10,
  },
  picker: {
    width: 100,
    height: 150,
  },
  pickerItem: {
    color: "#000",
    fontSize: 30,
    flex: 1,
    fontFamily: "PixelCode",
  },
  pickerLabel: {
    color: "#000",
    fontSize: 18,
    fontFamily: "ReadexProBold",
  },
});

export default DurationModal;
