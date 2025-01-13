import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user_session';

export async function saveLogin(email, password) {
  try {
    const userData = {
      userEmail: email,
      userPassword: password,
    };
    // console.log(userData);

    /*
    //   Before

    //     {
    //     userEmail: example@email.com
    //     userPassword: 1923811
    //     }

         before getSession: {"email": "flame@example.com", "password": undefined, "userId": "6735779c003679e2740a", "username": "Flamebamboo"}

 DEBUG  getSession retrieved: {"userId": {"email": "flame@example.com", "userId": "6735779c003679e2740a", "username": "Flamebamboo"}}

 DEBUG  after getSession: {"userId": {"email": "flame@example.com", "userId": "6735779c003679e2740a", "username": "Flamebamboo"}}
 LOG  [DEBUG] User is logged in: true

        */

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

    /*
      After using setItem

        @app_session,

        "userEmail: example@email.com
        userPassword: 1923811"

        */
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export async function getLogin() {
  try {
    const userDataStr = await AsyncStorage.getItem(USER_KEY);

    if (!userDataStr) {
      return null;
    }
    const userData = JSON.parse(userDataStr);

    return userData;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log('user session clear');
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
}
