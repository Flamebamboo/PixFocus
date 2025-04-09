import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '@/utils/color';
import PressableScale from '@/components/PressableScale';
import { getStreakData } from '@/lib/focusStats';
import { useGlobalContext } from '@/context/GlobalProvider';

const DailyStreaksSection = ({ statsData }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastMonth: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGlobalContext();

  // Fetch real streak data from the database
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setIsLoading(true);
        if (user && user.userId) {
          const data = await getStreakData(user);
          setStreakData(data);
        }
      } catch (error) {
        console.error('Error fetching streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreakData();
  }, [user, statsData]); // Re-fetch when statsData changes (e.g., date range changes)

  const renderCalendar = () => {
    // Split the days into 5 weeks
    const weeks = [];
    for (let i = 0; i < 5; i++) {
      weeks.push(streakData.lastMonth.slice(i * 7, (i + 1) * 7));
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.weekLabels}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <Text key={`day-${index}`} style={styles.weekDayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((isActive, dayIndex) => (
              <View
                key={`day-${weekIndex}-${dayIndex}`}
                style={[styles.dayBlock, isActive ? styles.activeDay : styles.inactiveDay]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily Streaks</Text>

      <View style={styles.streaksContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Loading streak data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.streakCards}>
              {/* Current Streak Card */}
              <View style={styles.streakCard}>
                <MaterialCommunityIcons name="fire" size={28} color={COLORS.orange} style={styles.streakIcon} />
                <Text style={styles.streakTitle}>Current Streak</Text>
                <Text style={styles.streakValue}>{streakData.currentStreak} days</Text>
              </View>

              {/* Longest Streak Card */}
              <View style={styles.streakCard}>
                <MaterialCommunityIcons name="trophy" size={28} color={COLORS.orange} style={styles.streakIcon} />
                <Text style={styles.streakTitle}>Longest Streak</Text>
                <Text style={styles.streakValue}>{streakData.longestStreak} days</Text>
              </View>
            </View>

            {/* Calendar section */}
            <View style={styles.calendarSection}>
              <Text style={styles.calendarTitle}>Last 5 Weeks</Text>
              {renderCalendar()}
              <Text style={styles.calendarHint}>Each block represents a day with completed focus sessions</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
  streaksContainer: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    minHeight: 280,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  loadingText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 12,
  },
  streakCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  streakCard: {
    width: '48%',
    backgroundColor: COLORS.lightpink,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    padding: 12,
    alignItems: 'center',
  },
  streakIcon: {
    marginBottom: 8,
  },
  streakTitle: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  streakValue: {
    fontFamily: 'PixelCodeBold',
    fontSize: 20,
    color: '#000',
  },
  calendarSection: {
    marginTop: 10,
  },
  calendarTitle: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendarHint: {
    fontFamily: 'PixelCode',
    fontSize: 12,
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 8,
  },
  calendarContainer: {
    marginTop: 8,
  },
  weekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  weekDayLabel: {
    fontFamily: 'PixelCode',
    fontSize: 12,
    color: COLORS.grey,
    width: 24,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayBlock: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  activeDay: {
    backgroundColor: COLORS.orange,
  },
  inactiveDay: {
    backgroundColor: '#e0e0e0',
  },
});

export default DailyStreaksSection;
