import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '@/utils/color';
import { formatStatsTime } from '@/utils/statsFormat';
import PressableScale from '@/components/PressableScale';
import SetTargetModal from './SetTargetModal';

const TargetHoursSection = ({ selectedRange, statsData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [targetHours, setTargetHours] = useState({
    day: [],
    week: [],
    month: [],
    year: [],
  });

  // Load saved targets (this would use AsyncStorage in a real implementation)
  useEffect(() => {
    const loadTargets = async () => {
      try {
        // In a real app, you would fetch this from AsyncStorage or a database
        // For now, we'll use mock data
        const mockTargets = {
          day: [
            { taskId: 1, label: 'Coding', targetSeconds: 7200, color: '#FF5733' },
            { taskId: 2, label: 'Reading', targetSeconds: 3600, color: '#33A1FF' },
          ],
          week: [
            { taskId: 1, label: 'Coding', targetSeconds: 18000, color: '#FF5733' },
            { taskId: 2, label: 'Reading', targetSeconds: 10800, color: '#33A1FF' },
          ],
          month: [],
          year: [],
        };

        setTargetHours(mockTargets);
      } catch (error) {
        console.error('Error loading target hours:', error);
      }
    };

    loadTargets();
  }, []);

  // Calculate completion percentage for a task
  const calculateCompletion = (taskLabel, targetSeconds) => {
    const taskData = statsData?.taskList?.find((task) => task.label === taskLabel);
    if (!taskData) return { current: 0, percentage: 0 };

    const currentSeconds = taskData.value;
    const percentage = Math.min(100, Math.round((currentSeconds / targetSeconds) * 100));

    return { current: currentSeconds, percentage };
  };

  // When targets are saved, you would typically save to storage here
  const handleSaveTargets = (newTargets) => {
    setTargetHours(newTargets);
    // In a real app: saveToAsyncStorage(newTargets);
  };

  return (
    <View className="mt-9 flex-1">
      <View className="flex-row justify-between items-center">
        <Text className="text-black text-xl font-PixelCodeBold">Target Goals</Text>
        <PressableScale onPress={() => setModalVisible(true)}>
          <View style={styles.settingsButton}>
            <MaterialCommunityIcons name="cog" size={24} color="black" />
          </View>
        </PressableScale>
      </View>

      {targetHours[selectedRange]?.length === 0 ? (
        <View style={styles.emptyContentCard}>
          <Text style={styles.emptyContentTitle}>No Targets Set</Text>
          <View style={styles.emptyContentDivider} />
          <Text style={styles.emptyContentText}>Tap the gear icon to set target hours</Text>
        </View>
      ) : (
        <View style={styles.targetsContainer}>
          {targetHours[selectedRange]?.map((target, index) => {
            const completion = calculateCompletion(target.label, target.targetSeconds);

            return (
              <View key={`${target.taskId}-${index}`} style={styles.targetItem}>
                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className="w-6 h-6 rounded-md" style={{ backgroundColor: target.color }}></View>
                    <Text className="text-black text-lg font-PixelCodeBold">{target.label}</Text>
                  </View>
                  <Text className="text-black text-md font-PixelCodeMedium">
                    {formatStatsTime(completion.current)} / {formatStatsTime(target.targetSeconds)}
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBar, { width: `${completion.percentage}%`, backgroundColor: target.color }]}
                  />
                  <Text style={styles.percentageText}>{completion.percentage}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <SetTargetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedRange={selectedRange}
        targetHours={targetHours}
        setTargetHours={handleSaveTargets}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  settingsButton: {
    width: 38,
    height: 38,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContentCard: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyContentTitle: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  emptyContentDivider: {
    width: '80%',
    height: 2,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  emptyContentText: {
    fontFamily: 'PixelCode',
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
  },
  targetsContainer: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    gap: 16,
  },
  targetItem: {
    width: '100%',
  },
  progressBarContainer: {
    height: 26,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  percentageText: {
    position: 'absolute',
    right: 8,
    top: 2,
    fontFamily: 'PixelCodeBold',
    fontSize: 14,
    color: '#000',
  },
});

export default TargetHoursSection;
