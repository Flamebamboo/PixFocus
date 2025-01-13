import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { router } from 'expo-router';
import { signOut } from '../../lib/appwrite';

const Settings = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

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
      router.replace('/(onboarding)/onboarding');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} color="white" size={24} />
          </TouchableOpacity>

          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.adsContainer}></View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support Us</Text>
          <View style={styles.sectionContent}></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Button title="Privacy Policy" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
            <View style={styles.row}>
              <Button title="Terms of Service" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>System Settings</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Button title="Change Language" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
            <View style={styles.row}>
              <Button title="Contact Us" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Contact Us</Text>
          <View style={styles.sectionContent}></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Legal</Text>
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <Button title="Privacy Policy" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
            <View style={styles.row}>
              <Button title="Terms of Service" onPress={() => {}} />
              <FontAwesomeIcon icon={faChevronRight} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },

  adsContainer: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 10,
  },
  placeholder: {
    width: 32, // Same width as the back button icon
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  userInfoWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'PixelifySans',
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    fontFamily: 'PixelifySans',
  },
  sectionContent: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
  },
  sectionContentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ReadexProBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PixelifySans',
  },
});

export default Settings;
