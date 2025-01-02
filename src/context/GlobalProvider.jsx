// context/GlobalProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/appwrite';
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
        if (hasLaunched === null) {
          setFirstLaunch(true);
          await AsyncStorage.setItem('firstLaunch', 'true');
        } else {
          setFirstLaunch(hasLaunched !== 'false');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    }

    checkOnFirstLaunch();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user status...');
      const userData = await getCurrentUser();

      if (userData) {
        console.log('User found:', userData);
        setIsLogged(true);
        setUser(userData);
      } else {
        console.log('No user found');
        setIsLogged(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setIsLogged(false);
      setUser(null);
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
