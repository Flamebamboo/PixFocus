import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { getByDay, getByWeek, getByMonth, getByYear } from '@/lib/focusStats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { formatStatsTime } from '@/utils/statsFormat';
import { router } from 'expo-router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateRangeControl from '@/components/DateRangeControl';

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

  const getRangeTitle = (range) => {
    switch (range) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'Today';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loading && user) {
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

  if (isInitialLoading || loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-custom-black">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!statsData.pieData.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-custom-black">
        <Text className="text-white text-2xl font-PixelifySans text-center px-4">
          No stats available for {getRangeTitle(selectedRange).toLowerCase()}.
          {selectedRange === 'day' ? ' Start a focus session to see your statistics!' : ''}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-custom-black">
      <ScrollView
        className="flex-1 px-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center px-4 py-6 mb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <FontAwesomeIcon icon={faArrowLeft} size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-4xl font-PixelifySans  text-white text-center mr-8">STATS</Text>
        </View>

        {/* Date control */}
        <View className="mb-5">
          <DateRangeControl selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
        </View>

        <View className="flex-row justify-between items-center gap-4">
          {/* card left */}
          <View className="bg-secondary-custom-black flex-1 flex-col justify-center rounded-3xl h-32 p-4">
            <Text className="text-white text-md text-center font-PixelifySans">Total Focus Time</Text>
            <View className="flex-1 justify-center">
              <Text className="text-white text-5xl text-center font-MedodicaRegular font-bold">
                {formatStatsTime(statsData.totalFocus)}
              </Text>
            </View>
          </View>
          {/* card right */}
          <View className="bg-secondary-custom-black flex-1 rounded-3xl h-32 p-4">
            <Text className="text-white text-md text-center font-PixelifySans">Most Focus</Text>
            <View className="flex-1 justify-center">
              <Text className="text-white text-2xl text-center font-PixelifySans font-bold">
                {statsData.mostFocus.label}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-9 flex-1 justify-center items-center">
          {!statsData.pieData.length ? (
            <Text className="text-white text-xl font-PixelifySans mt-4">Stats Unavailable</Text>
          ) : (
            <PieChart
              textColor="black"
              radius={150}
              textSize={20}
              data={statsData.pieData}
              donut
              innerRadius={80}
              innerCircleColor={'#141414'}
            />
          )}
        </View>
        {/* completion stats */}
        <View className="flex-1 mt-6">
          <View className="bg-secondary-custom-black flex-row rounded-3xl w-full h-32 p-4">
            <View className="flex-1 px-4 gap-6 justify-center items-start text-left">
              <Text className="text-white text-xl text-center font-PixelifySans">Completed Sessions</Text>
              <Text className="text-white text-xl text-center font-PixelifySans">Failed Sessions</Text>
            </View>

            <View className="justify-end items-end px-4">
              <View className="flex-1 justify-center">
                <Text className="text-white text-3xl text-center font-PixelifySans font-bold">
                  {statsData.completionData.completed || 0}
                </Text>
              </View>
              <View className="flex-1 justify-center">
                <Text className="text-white text-3xl text-center font-PixelifySans font-bold">
                  {statsData.completionData.failed || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mt-9 pb-10">
          {!statsData.taskList.length ? (
            <Text className="text-white text-xl font-PixelifySans mt-4">Task Data Unavailable</Text>
          ) : (
            statsData.taskList.map((task, index) => (
              <View className="flex-row justify-between items-center mt-5" key={`${task.label}-${index}`}>
                <View className="flex-row items-center gap-4 flex-1">
                  <View className="w-10 h-10 rounded-md" style={{ backgroundColor: task.color }}></View>
                  <Text className="text-white text-xl font-PixelifySans flex-shrink">{task.label}</Text>
                </View>
                <Text className="text-white text-2xl font-MedodicaRegular ml-2">{formatStatsTime(task.value)}</Text>
                <Text className="text-white text-2xl font-MedodicaRegular ml-4 w-20 text-right">
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
