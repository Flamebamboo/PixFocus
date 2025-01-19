import React, { useState, useCallback, useRef, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Pressable, Alert } from "react-native";
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/utils/color";
import DurationModal from "@/components/BottomSheet/DurationModal";

import { router } from "expo-router";
import { faTag, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import TaskSelector from "@/components/BottomSheet/TaskSelector";
import CustomButton from "@/components/Onboarding/CustomButton";
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import SegmentadControl from "@/components/SegmentadControl";

import TimerBlock from "@/components/TimerConfig/TimerBlock";
import Pomodoro from "@/components/TimerConfig/Pomodoro";
import useTimerStore from "@/store/timerStore";
import usePomodoroStore from "@/store/pomodoroStore";
import StartButton from "../StartButton";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CreateSessionModal = ({ bottomSheetModalRef }) => {
  const [snapPoints, setSnapPoints] = useState(["100%"]);
  const [selectedMode, setSelectedMode] = useState("timeblock");
  useEffect(() => {
    setSnapPoints(selectedMode === "timeblock" ? ["70%"] : ["100%"]);
  }, [selectedMode]);

  const durationModalRef = useRef(null);
  const taskSelectorRef = useRef(null);
  //using useState to keep track of the options

  //sending data to context api

  const task = useTimerStore((state) => state.task);
  const pomodoroTask = usePomodoroStore((state) => state.task);

  const handleCreateSession = () => {
    const currentTask = selectedMode === "timeblock" ? task : pomodoroTask;

    if (currentTask === "Select Task") {
      Alert.alert("Invalid Task", "Please select a task before creating a session");
      return;
    }

    bottomSheetModalRef.current?.dismiss();
    router.replace(selectedMode === "timeblock" ? "/(focus)/focus-timer" : "/(focus)/pomodoro-timer");
  };

  // Pomodoro Stuff

  // visibility of the options modal
  const [isDurationModalVisible, setIsDurationModalVisible] = useState(false);
  const [isTaskSelectorVisible, setIsTaskSelectorVisible] = useState(false);
  const [isModeVisible, setIsModeVisible] = useState(false);

  //handle opening modal
  const handleOpenDuration = useCallback(() => {
    setIsDurationModalVisible(true);
  }, []);

  const handleCloseDuration = useCallback(() => {
    setIsDurationModalVisible(false);
  }, []);

  const handleOpenTask = useCallback(() => {
    setIsTaskSelectorVisible(true);
  }, []);
  const handleCloseTask = useCallback(() => {
    setIsTaskSelectorVisible(false);
  }, []);

  // MAIN MODAL

  // darkbackdrop behind the modal
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleClossPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enableContentPanningGesture={false}
      enablePanDownToClose={true} //u can hold n slide down to close
      backgroundStyle={styles.modalBackground}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ display: "none" }}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.exitButton} onPress={handleClossPress}>
          <Ionicons name="close" size={30} color="#000" />
        </TouchableOpacity>
        <SegmentadControl
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          onChange={(mode) => setSelectedMode(mode)}
        />
      </View>

      {selectedMode === "timeblock" ? (
        <TimerBlock handleOpenTask={handleOpenTask} handleOpenDuration={handleOpenDuration} />
      ) : (
        <Pomodoro handleOpenTask={handleOpenTask} />
      )}

      {isTaskSelectorVisible && <TaskSelector taskSelectorRef={taskSelectorRef} onClose={handleCloseTask} />}

      {isDurationModalVisible && <DurationModal durationSheetRef={durationModalRef} onClose={handleCloseDuration} />}
      <View style={styles.buttonContainer}>
        <StartButton onPress={handleCreateSession} />
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: COLORS.lightpink,
    borderRadius: 40,
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  exitButton: {
    position: "absolute",
    top: 35,
    left: 15,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: "#000",
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
    paddingBottom: 10,
    width: "100%",
  },
});
