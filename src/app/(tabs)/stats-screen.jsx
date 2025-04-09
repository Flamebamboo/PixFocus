import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { getByDay, getByWeek, getByMonth, getByYear } from '@/lib/focusStats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatStatsTime } from '@/utils/statsFormat';
import { router } from 'expo-router';
import DateRangeControl from '@/components/Statistic/DateRangeControl';
import DateNavigator from '@/components/Statistic/DateNavigator';
import PressableScale from '@/components/PressableScale';
import COLORS from '@/utils/color';
import TargetHoursSection from '@/components/Statistic/TargetHoursSection';

//Notes:

/* 
EXAMPLE DATA STRUCTURES:

1. Raw data returned from API calls like getByDay, getByWeek, etc:
{
  totalFocusTime: 14400000, // 4 hours in milliseconds
  groupTask: [
    { value: 7200000, label: 'Coding', color: '#FF5733' },
    { value: 3600000, label: 'Reading', color: '#33A1FF' },
    { value: 1800000, label: 'Studying', color: '#33FF57' },
    { value: 1800000, label: 'Exercise', color: '#F033FF' }
  ],
  completionData: {
    completed: 8,
    failed: 2
  }
}

2. After processing in the component, statsData becomes:
{
  pieData: [
    { value: 7200000, color: '#FF5733' },
    { value: 3600000, color: '#33A1FF' },
    { value: 1800000, color: '#33FF57' },
    { value: 1800000, color: '#F033FF' }
  ],
  barData: [
    {
      value: 7200000,
      frontColor: '#FF5733',
      label: 'Coding',
      topLabelComponent: () => <Text>2h 0m</Text>
    },
    {
      value: 3600000,
      frontColor: '#33A1FF',
      label: 'Reading',
      topLabelComponent: () => <Text>1h 0m</Text>
    },
    {
      value: 1800000,
      frontColor: '#33FF57',
      label: 'Studying',
      topLabelComponent: () => <Text>0h 30m</Text>
    },
    {
      value: 1800000,
      frontColor: '#F033FF',
      label: 'Exercise',
      topLabelComponent: () => <Text>0h 30m</Text>
    }
  ],
  taskList: [
    { label: 'Coding', value: 7200000, valueP: 50, color: '#FF5733' },
    { label: 'Reading', value: 3600000, valueP: 25, color: '#33A1FF' },
    { label: 'Studying', value: 1800000, valueP: 12.5, color: '#33FF57' },
    { label: 'Exercise', value: 1800000, valueP: 12.5, color: '#F033FF' }
  ],
  totalFocus: 14400000,
  mostFocus: { value: 7200000, label: 'Coding', color: '#FF5733' },
  completionData: {
    completed: 8,
    failed: 2
  }
}
*/

const Stats = () => {
  const [selectedRange, setSelectedRange] = useState('day');
  const [dateInfo, setDateInfo] = useState({
    startDate: new Date(),
    endDate: new Date(),
    displayText: 'Today',
    currentDate: new Date(),
  });
  const [statsData, setStatsData] = useState({
    pieData: [],
    barData: [],
    taskList: [],
    totalFocus: null,
    mostFocus: '',
    completionData: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useGlobalContext();

  const calculatePercentage = (value, total) => {
    return (value / total) * 100;
  };

  const fetchStatsByRange = async (user, range, dateInfo) => {
    let data;

    try {
      // Create a custom date param based on selected range and dateInfo
      const dateParam = {
        range: range,
        date: dateInfo.currentDate, // For day
        startDate: dateInfo.startDate, // For week, month, year
        endDate: dateInfo.endDate, // For week
        year: dateInfo.startDate?.getFullYear(), // For year
        month: dateInfo.startDate?.getMonth(), // For month
      };

      switch (range) {
        case 'day':
          data = await getByDay(user, dateParam);
          break;
        case 'week':
          data = await getByWeek(user, dateParam);
          break;
        case 'month':
          data = await getByMonth(user, dateParam);
          break;
        case 'year':
          data = await getByYear(user, dateParam);
          break;
        default:
          data = await getByDay(user, dateParam);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching ${range} stats:`, error);
      return { totalFocusTime: 0, groupTask: [] };
    }
  };

  // Handle date changes from the DateNavigator
  const handleDateChange = (newDateInfo) => {
    setDateInfo(newDateInfo);
  };

  // Function to prepare bar chart data with visual capping for tall values
  const prepareBarChartData = (data) => {
    if (!data || !data.length) return [];

    // Fixed maximum visual height (5 hours in seconds)
    const maxVisualHeight = 5 * 3600;

    return data.map((item) => {
      // Create a display value capped at the maximum visual height
      const displayValue = Math.min(item.value, maxVisualHeight);

      // Check if this bar should be capped (value exceeds max visual height)
      const isCapped = item.value > maxVisualHeight;

      return {
        ...item,
        value: displayValue, // Use capped value for display
        originalValue: item.value, // Store original value for tooltip
        isCapped: isCapped,
      };
    });
  };

  // Calculate appropriate step values for the bar chart
  const calculateChartParameters = (data) => {
    // Use fixed parameters for consistent display
    return {
      maxValue: 3600 * 5, // 5 hours in seconds
      stepValue: 3600, // 1 hour in seconds
      noOfSections: 5, // 5 sections (1 per hour)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loading && user && dateInfo.startDate) {
          setIsLoading(true);

          // Pass the updated dateInfo to fetch function
          const data = await fetchStatsByRange(user, selectedRange, dateInfo);

          if (!data?.groupTask?.length) {
            setStatsData({
              pieData: [],
              barData: [],
              taskList: [],
              totalFocus: 0,
              mostFocus: '',
              completionData: {},
            });
            return;
          }

          const mostFocus = data.groupTask.reduce((acc, curr) => {
            return acc.value > curr.value ? acc : curr;
          });

          const totalFocus = data.totalFocusTime;
          const completionData = data.completionData;

          const pieChartData = data.groupTask.map((task) => ({
            value: task.value,
            color: task.color,
          }));

          // Process bar chart data with visual capping
          const barChartData = prepareBarChartData(
            data.groupTask.map((task) => ({
              value: task.value,
              frontColor: task.color,
              label: task.label,
            }))
          );

          const taskList = data.groupTask.map((task) => ({
            label: task.label,
            value: task.value,
            valueP: calculatePercentage(task.value, totalFocus),
            color: task.color,
          }));

          setStatsData({
            pieData: pieChartData,
            barData: barChartData,
            taskList: taskList,
            totalFocus: totalFocus,
            mostFocus: mostFocus,
            completionData: completionData,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, selectedRange, dateInfo]);

  // Compute chart parameters once when rendering
  const chartParams = calculateChartParameters(statsData.barData);

  // Component for displaying empty state with a custom message
  const EmptyStateMessage = ({ message, icon }) => (
    <View style={styles.emptyStateContainer}>
      <MaterialCommunityIcons name={icon} size={64} color={COLORS.grey} style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  // Component for content cards when data is unavailable
  const EmptyContentCard = ({ title }) => (
    <View style={styles.emptyContentCard}>
      <Text style={styles.emptyContentTitle}>{title}</Text>
      <View style={styles.emptyContentDivider} />
      <Text style={styles.emptyContentText}>No data available for this period</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* header */}
        <PressableScale style={styles.exitButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000" />
        </PressableScale>
        <View className="flex-row justify-center w-full items-center py-6 mb-3">
          <Text className="text-3xl font-PixelCodeBold text-black text-center ">Statistic</Text>
        </View>

        {/* Date control */}
        <View className="mb-5 mt-2 flex bg-white items-center">
          <DateRangeControl selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
        </View>

        {/* Date Navigator (new component) */}
        <DateNavigator selectedRange={selectedRange} onDateChange={handleDateChange} />

        {/* Summary Stats Row */}
        <View className="flex-row justify-between items-center gap-4">
          {/* Total Time Card */}
          <View className="bg-white border-4 flex-1 flex-col justify-center rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Total Time</Text>
            <View className="flex-1 justify-center">
              {statsData.totalFocus ? (
                <Text className="text-black font-PixelCodeMedium text-4xl text-center font-bold">
                  {formatStatsTime(statsData.totalFocus)}
                </Text>
              ) : (
                <Text className="text-gray-400 font-PixelCodeMedium text-xl text-center">No data yet</Text>
              )}
            </View>
          </View>

          {/* Most Focused Task Card */}
          <View className="bg-white border-4 flex-1 rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Most Focus</Text>
            <View className="flex-1 justify-center">
              {statsData.mostFocus && statsData.mostFocus.label ? (
                <Text className="text-black text-2xl text-center font-PixelCodeMedium">
                  {statsData.mostFocus.label}
                </Text>
              ) : (
                <Text className="text-gray-400 text-xl text-center font-PixelCodeMedium">No tasks yet</Text>
              )}
            </View>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View className="mt-9 flex-1 justify-center items-center">
          <Text className="text-black text-xl font-PixelCodeBold mb-4">Task Distribution</Text>
          {!statsData.barData.length ? (
            <View style={styles.barChartContainer}>
              <EmptyStateMessage message="No task data for this time period" icon="chart-bar" />
            </View>
          ) : (
            <View style={styles.barChartContainer}>
              <BarChart
                data={statsData.barData}
                barWidth={30}
                spacing={20}
                barBorderRadius={6}
                hideYAxisText={true}
                xAxisThickness={3}
                yAxisThickness={3}
                isAnimated
                xAxisColor={'black'}
                showFractionalValues={false}
                maxValue={18000} // Fixed 5 hours (18000 seconds)
                stepValue={3600} // 1 hour in seconds
                noOfSections={5} // 5 sections
                disableScroll={true}
                height={250}
                width={300}
                xAxisLabelTextStyle={{ color: 'black', fontSize: 9, fontFamily: 'PixelCodeMedium' }}
                renderTooltip={(item) => (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{formatStatsTime(item.originalValue || item.value)}</Text>
                  </View>
                )}
                tooltipConfig={{
                  displayY: true,
                  tooltipBottom: true,
                  containerStyle: styles.tooltipOuterContainer,
                }}
              />
            </View>
          )}
        </View>

        {/* Pie Chart Section */}
        <View className="mt-9 flex-1 justify-center items-center">
          <Text className="text-black text-xl font-PixelCodeBold mb-4">Focus Distribution</Text>
          {!statsData.pieData.length ? (
            <View style={styles.pieChartContainer}>
              <EmptyStateMessage message="No distribution data available" icon="chart-pie" />
            </View>
          ) : (
            <PieChart
              textColor="black"
              radius={150}
              textSize={20}
              data={statsData.pieData}
              donut
              innerRadius={80}
              innerCircleColor={COLORS.lightpink}
            />
          )}
        </View>

        {/* Completion Stats */}
        <View className="flex-1 mt-6">
          <Text className="text-black text-xl font-PixelCodeBold mb-4">Session Results</Text>
          <View className="bg-white border-4 flex-row rounded-3xl w-full p-4">
            {!statsData.completionData.total ? (
              <View style={styles.emptyCompletionStats}>
                <MaterialCommunityIcons name="check-circle-outline" size={32} color={COLORS.grey} />
                <Text style={styles.emptyCompletionText}>No session data yet</Text>
              </View>
            ) : (
              <>
                <View className="flex-1 px-4 gap-6 justify-center items-start text-left">
                  <Text className="text-black text-xl text-center font-PixelCodeBold">Completed Sessions</Text>
                  <Text className="text-black text-xl text-center font-PixelCodeBold">Failed Sessions</Text>
                </View>

                <View className="justify-end items-end px-4">
                  <View className="flex-1 justify-center">
                    <Text className="text-black text-3xl text-center font-PixelCodeMedium font-bold">
                      {statsData.completionData.completed || 0}
                    </Text>
                  </View>
                  <View className="flex-1 justify-center">
                    <Text className="text-black text-3xl text-center font-PixelCodeMedium font-bold">
                      {statsData.completionData.failed || 0}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Target Hours Section */}
        <TargetHoursSection selectedRange={selectedRange} statsData={statsData} />

        {/* Task List Section */}
        <View className="mt-9 pb-10">
          <Text className="text-black text-xl font-PixelCodeBold mb-4">Task Breakdown</Text>
          {!statsData.taskList.length ? (
            <EmptyContentCard title="No task data" />
          ) : (
            statsData.taskList.map((task, index) => (
              <View className="flex-row justify-between items-center mt-5" key={`${task.label}-${index}`}>
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="w-10 h-10 rounded-md" style={{ backgroundColor: task.color }}></View>
                  <Text className="text-black text-2xl font-PixelCodeMedium flex-shrink">{task.label}</Text>
                </View>
                <Text className="text-black text-2xl font-PixelCodeMedium ml-2">{formatStatsTime(task.value)}</Text>
                <Text className="text-black text-2xl font-PixelCodeMedium ml-4 w-20 text-right">
                  {task.valueP.toFixed(1)}%
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10,

    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  exitButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 999, // Add zIndex to ensure button is clickable
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: '#000',
    width: 40,
    height: 40,
  },
  barChartContainer: {
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative', // Ensure proper stacking context
    width: '100%',
    minHeight: 250,
  },
  tooltipOuterContainer: {
    zIndex: 9999, // Very high z-index to ensure it's above everything
    elevation: 10, // For Android
  },
  tooltip: {
    backgroundColor: COLORS.orange,

    padding: 8,
    borderRadius: 8,
    zIndex: 9999, // Very high z-index
    elevation: 10, // For Android
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    position: 'absolute', // Position absolutely
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipText: {
    color: 'white',
    fontFamily: 'PixelCodeMedium',
    fontSize: 12,
    textAlign: 'center',
  },
  barTopLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  barTopLabelText: {
    color: '#000',
    fontSize: 10,
    fontFamily: 'PixelCodeMedium',
  },
  pieChartContainer: {
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    minHeight: 300,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 220,
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyStateText: {
    fontFamily: 'PixelCode',
    fontSize: 18,
    color: COLORS.grey,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  emptyCompletionStats: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyCompletionText: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 10,
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
});
