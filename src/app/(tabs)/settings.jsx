import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Switch,
} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "../../lib/appwrite";
import COLORS from "@/utils/color";
import PressableScale from "@/components/PressableScale";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHaptics } from "@/hooks/useHaptics";
import notifee from "@notifee/react-native";

const Settings = () => {
  const {
    user,
    setUser,
    setIsLogged,
    isHapticsEnabled,
    setIsHapticsEnabled,
    isNotificationsEnabled,
    setIsNotificationsEnabled,
  } = useGlobalContext();
  const { triggerHaptic } = useHaptics();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (user) {
      setUserName(user.username);
      setUserEmail(user.email);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/(onboarding)/onboarding");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleHaptics = async () => {
    try {
      const newValue = !isHapticsEnabled;
      await AsyncStorage.setItem("hapticsEnabled", String(newValue));
      setIsHapticsEnabled(newValue);

      // Only trigger if enabling
      if (newValue) {
        triggerHaptic("light");
      }
    } catch (error) {
      console.error("Error saving haptics setting:", error);
    }
  };

  const toggleNotification = async () => {
    try {
      // Request permissions (required for iOS)
      await notifee.requestPermission();
      const newValue = !isNotificationsEnabled;
      await AsyncStorage.setItem("notificationEnabled", String(newValue));
      setIsNotificationsEnabled(newValue);

      // Only trigger if enabling
      if (newValue) {
        triggerHaptic("light");
      }
    } catch (error) {
      console.error("Error saving notification setting:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PressableScale style={styles.exitButton} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000" />
        </PressableScale>
        <View style={styles.headerContainer}>
          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* Reminder need update to configure paywall */}
        {/* <View style={styles.adsContainer}>
          <View style={styles.adsWrap}>
            <Text style={styles.adsBrand}>PixFocus Pro</Text>
            <Text style={styles.adsSubText}>Unlock all amazing features</Text>
          </View>

          <PressableScale style={styles.adsButton}>
            <Text style={styles.adsBtnText}>Try Free</Text>
          </PressableScale>
        </View> */}

        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.sectionHeader}>System Settings</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Enable Haptics</Text>
              <Switch
                trackColor={{ false: "#767577", true: COLORS.green }}
                thumbColor={isHapticsEnabled ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#767577"
                onValueChange={toggleHaptics}
                value={isHapticsEnabled}
              />
            </View>
            {/* <View style={styles.row}>
              <Text style={styles.textBtn}>Language</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View> */}
            <View style={styles.row}>
              <Text style={styles.textBtn}>Notifications</Text>
              <Switch
                trackColor={{ false: "#767577", true: COLORS.green }}
                ios_backgroundColor="#767577"
                thumbColor={isHapticsEnabled ? "#fff" : "#f4f3f4"}
                onValueChange={toggleNotification}
                value={isNotificationsEnabled}
              />
            </View>
            <View style={styles.row}>
              <View className="flex-col">
                <Text style={styles.textBtn}>App Icon</Text>
                <Text className="text-xs text-red-600 font-ReadexProBold">Coming Soon</Text>
              </View>

              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Privacy Policy</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Terms Of Services</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
          </View>
        </View> */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support Us</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Share PixFocus With Friends</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Rate Us 5 Stars On Appstore </Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Contact Me</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Email Me</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Instagram</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
            <View style={styles.row}>
              <Text style={styles.textBtn}>Twitter/X</Text>
              <FontAwesomeIcon icon={faChevronRight} color="black" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        <View className="pb-24">
          <Text className="font-PixelCodeDemiBoldItalic text-center text-gray-500 mt-9">
            ~ Made With Passion By FlameBamboo, PixFocus
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: "100%",
    backgroundColor: COLORS.lightpink,
  },

  exitButton: {
    position: "absolute",
    top: 35,
    left: 30,
    zIndex: 999, // Add zIndex to ensure button is clickable
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRadius: 9,
    borderColor: "#000",
    width: 40,
    height: 40,
  },

  adsContainer: {
    display: "flex",
    width: "100%",
    height: "13%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 4,
    backgroundColor: COLORS.orange,
  },

  adsButton: {
    backgroundColor: "#fff",
    height: 50,
    width: 100,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  adsBtnText: {
    fontFamily: "ReadexProSemiBold",
    fontSize: 16,
  },

  adsBrand: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#fff",
    fontFamily: "PixelCodeMedium",
  },

  adsSubText: {
    fontSize: 12,
    color: "#F3EFEF",
    fontFamily: "ReadexProSemiBold",
  },

  adsWrap: {
    display: "flex",
    flexDirection: "column",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "space-between",
  },

  scrollViewContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  userInfoWrapper: {
    flex: 1,
    alignItems: "center",
  },
  userInfoContainer: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "PixelCodeBold",
    textAlign: "center",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    fontFamily: "ReadexProRegular",
    textAlign: "center",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "gray",
    fontFamily: "PixelCodeMedium",
  },

  sectionContent: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryYellow,
    borderWidth: 4,
  },
  textBtn: {
    color: "#000",
    fontSize: 16,
    fontFamily: "ReadexProSemiBold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    paddingRight: 5, // Add some padding for the switch
  },

  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PixelCodeBold",
  },
});

export default Settings;
