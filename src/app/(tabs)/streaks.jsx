import { View, Text } from 'react-native';
import React from 'react';
import ProgressGoalCard from '@/components/TempUnused/ProgressGoalCard';
import DailyStreaksCard from '@/components/TempUnused/DailyStreaksCard';
import DailyStreaksSection from '@/components/Statistic/DailyStreaksSection';
import MotivationalQuoteCard from '@/components/TempUnused/MotivationalQuoteCard';

const streaks = () => {
  return (
    <View>
      <ProgressGoalCard />
      <DailyStreaksCard />
      <DailyStreaksSection />
      <MotivationalQuoteCard />
    </View>
  );
};

export default streaks;
