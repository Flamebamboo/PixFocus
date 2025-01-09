// context/GlobalProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, checkStoredSession, clearAllAsyncStorage } from '../lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  useEffect(() => {
    async function checkOnFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem('firstLaunch');
        if (hasLaunched === 'false') {
          setFirstLaunch(false);
        } else if (hasLaunched === null) {
          setFirstLaunch(true);
          await AsyncStorage.setItem('firstLaunch', 'true');
        } else {
          setFirstLaunch(hasLaunched === 'true');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        // Default to false in case of error
        setFirstLaunch(false);
      }
    }

    checkOnFirstLaunch();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user status...');
      const storedSession = await checkStoredSession();

      if (storedSession) {
        console.log('Found stored session');
        setIsLogged(true);
        setUser(storedSession.userData);
      } else {
        const userData = await getCurrentUser();
        if (userData) {
          setIsLogged(true);
          setUser(userData);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setIsLogged(false);
      setUser(null);
      clearAllAsyncStorage();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        firstLaunch,
        setFirstLaunch,
        refreshUser: checkUser, // Add this function to refresh user state
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
