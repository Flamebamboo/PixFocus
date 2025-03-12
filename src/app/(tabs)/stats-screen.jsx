import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { getByDay, getByWeek, getByMonth, getByYear } from '@/lib/focusStats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import { formatStatsTime } from '@/utils/statsFormat';
import { router } from 'expo-router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateRangeControl from '@/components/Statistic/DateRangeControl';
import PressableScale from '@/components/PressableScale';
import COLORS from '@/utils/color';

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
  const [statsData, setStatsData] = useState({
    pieData: [],
    barData: [],
    taskList: [],
    totalFocus: null,
    mostFocus: '',
    completionData: {},
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { user, loading } = useGlobalContext();

  const calculatePercentage = (value, total) => {
    return (value / total) * 100;
  };

  const fetchStatsByRange = async (user, range) => {
    let data;
    switch (range) {
      case 'day':
        data = await getByDay(user);
        break;
      case 'week':
        data = await getByWeek(user);
        break;
      case 'month':
        data = await getByMonth(user);
        break;
      case 'year':
        data = await getByYear(user);
        break;
      default:
        data = await getByDay(user);
    }
    return data;
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
        if (!loading && user) {
          /*

          user looks like this
           {userId: currentAccount.$id,
          email: currentAccount.email,
          password: currentAccount.password,
          username: currentAccount.name,}
    
          
          */

          const data = await fetchStatsByRange(user, selectedRange);

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
        setIsInitialLoading(false);
      }
    };

    if (isInitialLoading) {
      fetchData();
    } else {
      fetchData(); // Will update data without showing loading screen
    }
  }, [user, loading, selectedRange]);

  // Compute chart parameters once when rendering
  const chartParams = calculateChartParameters(statsData.barData);

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

        {/* card here */}
        <View className="flex-row justify-between items-center gap-4">
          {/* card left */}

          <View className=" bg-white border-4 flex-1 flex-col justify-center rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Total Time</Text>
            <View className="flex-1 justify-center">
              <Text className="text-blacr font-PixelCodeMedium text-4xl text-center font-bold">
                {formatStatsTime(statsData.totalFocus)}
              </Text>
            </View>
          </View>

          {/* card right */}
          <View className=" bg-white border-4 flex-1 rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Most Focus</Text>
            <View className="flex-1 justify-center">
              <Text className="text-black text-2xl text-center font-PixelCodeMedium">{statsData.mostFocus.label}</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View className="mt-9 flex-1 justify-center items-center">
          <Text className="text-black text-xl font-PixelCodeBold mb-4">Task Distribution</Text>
          {!statsData.barData.length ? (
            <Text className="text-black text-xl font-PixelCodeDemiBoldItalic mt-4">Bar Chart Unavailable</Text>
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

        <View className="mt-9 flex-1 justify-center items-center">
          {!statsData.pieData.length ? (
            <Text className="text-black text-xl font-PixelCodeDemiBoldItalic mt-4">Stats Chart Unavailable</Text>
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

        {/* completion stats */}
        <View className="flex-1 mt-6">
          <View className="bg-white border-4 flex-row rounded-3xl w-full h-32 p-4">
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
          </View>
        </View>
        <View className="mt-9 pb-10">
          {!statsData.taskList.length ? (
            <Text className="text-black text-xl text-center font-PixelCodeDemiBoldItalic mt-4">
              Task Data Unavailable
            </Text>
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
});
