import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
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
the getByDay returns the total focus time and the groupTask

group task is an array of objects that contains the value, label, and frontColor
sample: 
[
{
  value: 1000,
  label: 'task',
  frontColor: 'red'
}
  ]



*/

const Stats = () => {
  const [selectedRange, setSelectedRange] = useState('day');
  const [statsData, setStatsData] = useState({
    pieData: [],
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

          const taskList = data.groupTask.map((task) => ({
            label: task.label,
            value: task.value,
            valueP: calculatePercentage(task.value, totalFocus),
            color: task.color,
          }));

          setStatsData({
            pieData: pieChartData,
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
        <View className="mb-5 mt-2 flex items-center">
          <DateRangeControl selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
        </View>

        {/* card here */}
        <View className="flex-row justify-between items-center gap-4">
          {/* card left */}

          <View className=" bg-secondary-pink border-4 flex-1 flex-col justify-center rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Total Time</Text>
            <View className="flex-1 justify-center">
              <Text className="text-blacr font-PixelCodeMedium text-4xl text-center font-bold">
                {formatStatsTime(statsData.totalFocus)}
              </Text>
            </View>
          </View>

          {/* card right */}
          <View className="bg-primary-green border-4 flex-1 rounded-3xl h-32 p-4">
            <Text className="text-black text-xl text-center font-PixelCodeMedium">Most Focus</Text>
            <View className="flex-1 justify-center">
              <Text className="text-black text-2xl text-center font-PixelCodeMedium">{statsData.mostFocus.label}</Text>
            </View>
          </View>
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
          <View className="bg-primary-blue border-4 flex-row rounded-3xl w-full h-32 p-4">
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
    backgroundColor: COLORS.lightpink,
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
});
