// context/GlobalProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLogin } from '@/utils/userSessions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkExistingSession, signIn, getUserDetails, clearAllAsyncStorage } from '@/lib/appwrite';
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(null);

  /*

  IF user launch for the first time go to onboarding


  
  
  
  
  */

  async function checkOnFirstLaunch() {
    try {
      //check if user have launched before if they have we can redirect to onboarding
      const hasLaunched = await AsyncStorage.getItem('firstLaunch');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('firstLaunch', 'true');
        setFirstLaunch(true);
        setIsLogged(false);
        setUser(null);
      }
      //not their first launch meaning they have completed their onboarding, now we have to check if the user is logged in or not
      else {
        const { isValid } = await checkExistingSession();

        if (isValid) {
          const userDetails = await getUserDetails();
          setUser(userDetails);
          setIsLogged(true);
        } else {
          const loginDetails = await getLogin();
          /* {"userEmail": "flame@example.com", "userPassword": "123123123"} */
          if (loginDetails) {
            const { userEmail, userPassword } = loginDetails;
            try {
              await signIn(userEmail, userPassword, setUser);

              console.log('auto signed in success');
              setIsLogged(true);
            } catch (error) {
              console.log(error);
              setIsLogged(false);
              clearAllAsyncStorage();
            }
          } else {
            console.log('no data');
            setIsLogged(false);
            clearAllAsyncStorage();
          }
        }

        setFirstLaunch(false);
        await AsyncStorage.setItem('firstLaunch', 'false');
      }
    } catch (error) {
      console.error(error);
      setIsLogged(false);

      setUser(null);
      setFirstLaunch(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkOnFirstLaunch();
  }, []);

  useEffect(() => {
    const loadHapticsSettings = async () => {
      try {
        const hapticsEnabled = await AsyncStorage.getItem('hapticsEnabled');
        setIsHapticsEnabled(hapticsEnabled !== 'false');
      } catch (error) {
        console.error('Error loading haptics settings:', error);
      }
    };

    const loadNotificationsSettings = async () => {
      try {
        const notificationEnabled = await AsyncStorage.getItem('notificationEnabled');
        setIsNotificationsEnabled(notificationEnabled !== 'false');
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };
    loadNotificationsSettings();
    loadHapticsSettings();
  }, []);

  // async function response() {
  //   const response = await getUserDetails();
  //   console.log('response ' + JSON.stringify(response));

  //   /*{"userId":"6735779c003679e2740a","email":"flame@example.com","username":"Flamebamboo"}*/
  // }

  // useEffect(() => {
  //   response();
  //   console.log('is logged ' + isLogged);
  //   console.log('user ' + user);
  // }, [isLogged]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        firstLaunch,
        setFirstLaunch,
        loading,
        isHapticsEnabled,
        setIsHapticsEnabled,
        isNotificationsEnabled,
        setIsNotificationsEnabled,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
