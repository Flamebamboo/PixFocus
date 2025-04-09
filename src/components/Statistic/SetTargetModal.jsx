import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '@/utils/color';
import PressableScale from '@/components/PressableScale';

const { width, height } = Dimensions.get('window');

// Helper function to truncate text
const truncateText = (text, maxLength = 12) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const SetTargetModal = ({ visible, onClose, selectedRange, targetHours, setTargetHours }) => {
  const [editingTargets, setEditingTargets] = useState({
    day: [],
    week: [],
    month: [],
    year: [],
  });

  const [availableTasks, setAvailableTasks] = useState([
    { id: 1, label: 'Coding', color: '#FF5733' },
    { id: 2, label: 'Reading', color: '#33A1FF' },
    { id: 3, label: 'Studying', color: '#33FF57' },
    { id: 4, label: 'Exercise', color: '#F033FF' },
  ]);

  useEffect(() => {
    if (visible) {
      setEditingTargets({ ...targetHours });
    }
  }, [visible, targetHours]);

  const handleAddTarget = (taskId) => {
    const task = availableTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (editingTargets[selectedRange]?.some((t) => t.taskId === taskId)) return;

    const updatedTargets = { ...editingTargets };
    if (!updatedTargets[selectedRange]) {
      updatedTargets[selectedRange] = [];
    }

    updatedTargets[selectedRange] = [
      ...updatedTargets[selectedRange],
      { taskId: taskId, label: task.label, targetSeconds: 3600, color: task.color },
    ];

    setEditingTargets(updatedTargets);
  };

  const handleRemoveTarget = (taskId) => {
    const updatedTargets = { ...editingTargets };
    updatedTargets[selectedRange] = editingTargets[selectedRange]?.filter((t) => t.taskId !== taskId);
    setEditingTargets(updatedTargets);
  };

  const handleUpdateTime = (taskId, hours, minutes) => {
    const hoursValue = parseInt(hours) || 0;
    const minutesValue = parseInt(minutes) || 0;

    const updatedTargets = { ...editingTargets };
    updatedTargets[selectedRange] = editingTargets[selectedRange]?.map((target) => {
      if (target.taskId === taskId) {
        return {
          ...target,
          targetSeconds: hoursValue * 3600 + minutesValue * 60,
        };
      }
      return target;
    });

    setEditingTargets(updatedTargets);
  };

  const handleSave = () => {
    setTargetHours(editingTargets);
    onClose();
  };

  const getTimeValues = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  const rangeLabel = {
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly',
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{rangeLabel[selectedRange]} Target Hours</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {/* Current Targets Section */}
            <Text style={styles.sectionTitle}>Current Targets</Text>
            <View style={styles.currentTargetsWrapper}>
              {!editingTargets[selectedRange] || editingTargets[selectedRange].length === 0 ? (
                <Text style={styles.noTargetsText}>No targets set</Text>
              ) : (
                <ScrollView
                  style={styles.targetScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {editingTargets[selectedRange].map((target) => {
                    const { hours, minutes } = getTimeValues(target.targetSeconds);
                    return (
                      <View key={target.taskId} style={styles.targetEditRow}>
                        <View style={styles.targetLabelContainer}>
                          <View style={[styles.colorSquare, { backgroundColor: target.color }]} />
                          <Text style={styles.targetLabel} numberOfLines={1} ellipsizeMode="tail">
                            {truncateText(target.label)}
                          </Text>
                        </View>

                        <View style={styles.timeInputContainer}>
                          <TextInput
                            style={[styles.timeInput, { backgroundColor: COLORS.lightpink, width: 52 }]}
                            value={hours.toString()}
                            onChangeText={(text) => handleUpdateTime(target.taskId, text, minutes)}
                            keyboardType="numeric"
                            maxLength={3}
                          />
                          <Text style={styles.timeUnitText}>h</Text>

                          <TextInput
                            style={[styles.timeInput, { backgroundColor: COLORS.lightpink }]}
                            value={minutes.toString()}
                            onChangeText={(text) => handleUpdateTime(target.taskId, hours, text)}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                          <Text style={styles.timeUnitText}>m</Text>
                        </View>

                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveTarget(target.taskId)}>
                          <MaterialCommunityIcons name="trash-can-outline" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* Add New Target Section */}
            <Text style={styles.sectionTitle}>Add New Target</Text>
            <View style={styles.availableTasksContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={styles.taskListContent}
                nestedScrollEnabled={true}
              >
                {availableTasks
                  .filter((task) => !editingTargets[selectedRange]?.some((t) => t.taskId === task.id))
                  .map((task) => (
                    <PressableScale key={task.id} onPress={() => handleAddTarget(task.id)} style={styles.taskButton}>
                      <View style={[styles.taskColor, { backgroundColor: task.color }]} />
                      <Text style={styles.taskButtonText} numberOfLines={1} ellipsizeMode="tail">
                        {truncateText(task.label)}
                      </Text>
                    </PressableScale>
                  ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PressableScale style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Targets</Text>
            </PressableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.7, // Fixed height
    backgroundColor: COLORS.lightpink,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#000',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: COLORS.orange,
  },
  modalTitle: {
    fontFamily: 'PixelCodeBold',
    fontSize: 20,
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  modalBody: {
    padding: 16,
    flex: 1, // Take up available space
  },
  sectionTitle: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  currentTargetsWrapper: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    marginBottom: 16,
    height: height * 0.3, // Fixed height for the wrapper
  },
  targetScrollView: {
    flex: 1, // Take up available space in wrapper
  },
  noTargetsText: {
    fontFamily: 'PixelCode',
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    paddingVertical: 16,
  },
  targetEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
  },
  targetLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '45%',
  },
  colorSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  targetLabel: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timeInput: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'PixelCodeMedium',
    fontSize: 16,
    padding: 0,
  },
  timeUnitText: {
    fontFamily: 'PixelCode',
    fontSize: 16,
    marginHorizontal: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  availableTasksContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: 70,
    marginBottom: 5,
  },
  taskListContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  taskButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    height: 46,
  },
  taskColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  taskButtonText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  saveButtonText: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#fff',
  },
});

export default SetTargetModal;
