import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite';
import { Query } from 'react-native-appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '@/components/PressableScale';
import COLORS from '@/utils/color';
import { formatStatsTime } from '@/utils/statsFormat';

import * as Localization from 'expo-localization';

import { getLeaderboardData } from '@/lib/focusStats';

const Leaderboard = () => {
  const { user, setUser } = useGlobalContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isCurrentUserInTopRanks, setIsCurrentUserInTopRanks] = useState(false);

  const period = () => {
    const now = new Date();

    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);

    const ends = new Date(now);
    ends.setDate(now.getDate() - now.getDay());
    ends.setHours(23, 59, 59, 999);

    return `${sunday.toLocaleDateString()} - ${ends.toLocaleDateString()} `;
  };

  // On first opening leaderboard, if opt-in flag is unset, prompt user
  useEffect(() => {
    if (user && user.leaderboard === undefined) {
      Alert.alert(
        'Join the Leaderboard?',
        'Would you like to share your focus time on the weekly public leaderboard?',
        [
          { text: 'No, thanks', onPress: () => updateLeaderboardFlag(false) },
          { text: 'Yes, let’s go', onPress: () => updateLeaderboardFlag(true) },
        ],
        { cancelable: false }
      );
    } else if (user && user.leaderboard) {
      fetchLeaderboardData();
    }
  }, [user]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboardData(user);
      console.log('Fetched leaderboard data:', data);

      // Find the current user's position in the leaderboard
      const currentUserPosition = data.findIndex((item) => item.userId === user.userId);
      setCurrentUserRank(currentUserPosition !== -1 ? currentUserPosition + 1 : null);

      // Check if the user is in the top visible ranks (e.g., top 10)
      setIsCurrentUserInTopRanks(currentUserPosition !== -1 && currentUserPosition < 10);

      setUsers(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateLeaderboardFlag = async (value) => {
    try {
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collectionId, user.docId, {
        leaderboard: value,
      });
      setUser({ ...user, leaderboard: value });
      if (value) fetchLeaderboardData();
      else {
        setUsers([]);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to save leaderboard preference:', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboardData();
  };

  const renderItem = ({ item, index }) => {
    const isCurrentUser = user && item.userId === user.userId;

    return (
      <View style={[styles.userRow, isCurrentUser && styles.currentUserRow]}>
        <View style={[styles.rankContainer, index < 3 ? styles.topThreeRank : null]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username || 'Anonymous'}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatStatsTime(item.totalFocusTime || 0)}</Text>
        </View>
      </View>
    );
  };

  // Render the current user's entry for the sticky footer
  const renderCurrentUserEntry = () => {
    if (!user || currentUserRank === null) return null;

    const currentUserData = users.find((item) => item.userId === user.userId);
    if (!currentUserData) return null;

    return (
      <View style={styles.stickyFooter}>
        <View style={styles.userRow}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{currentUserRank}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{currentUserData.username || 'You'}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatStatsTime(currentUserData.totalFocusTime || 0)}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PressableScale style={styles.exitButton} onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="#000" />
          </PressableScale>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>{period()}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5733" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PressableScale style={styles.exitButton} onPress={() => router.back()}>
            <Ionicons name="close" size={32} color="#000" />
          </PressableScale>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>{period()}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PressableScale style={styles.exitButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000" />
        </PressableScale>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>{period()}</Text>
        <Text className="text-center font-PixelCodeLight mt-2 text-sm">*Reset on every Sunday 23:59</Text>
      </View>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No focus data available yet</Text>
          <Text style={styles.emptySubtext}>Complete focus sessions to see your rank!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={users}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId || Math.random().toString()}
            contentContainerStyle={[styles.listContainer, !isCurrentUserInTopRanks && { paddingBottom: 80 }]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF5733']} tintColor="#FF5733" />
            }
          />

          {/* Show current user at bottom if not in top ranks */}
          {!isCurrentUserInTopRanks && currentUserRank !== null && renderCurrentUserEntry()}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.lightpink, // Using the app's light pink background
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    position: 'relative',
  },
  exitButton: {
    position: 'absolute',
    top: 16,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PixelCodeBold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PixelCode',
    color: '#000',
    textAlign: 'center',
    width: 250,
    marginTop: 10,
  },

  listContainer: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000',
  },
  currentUserRow: {
    backgroundColor: COLORS.green,
    borderWidth: 4,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#000',
  },
  topThreeRank: {
    backgroundColor: '#FFD700', // Gold for top 3
  },
  rankText: {
    fontSize: 18,
    fontFamily: 'PixelCodeBold',
    color: '#000',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'PixelCodeMedium',
    color: '#000',
  },
  timeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.secondaryYellow,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'PixelCodeBold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#000',
    fontSize: 16,
    fontFamily: 'PixelCodeMedium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5733',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'PixelCodeMedium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'PixelCodeBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'PixelCodeMedium',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.lightpink,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Leaderboard;
