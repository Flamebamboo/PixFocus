import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import CustomButton from '@/components/Onboarding/CustomButton';
import { router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const submit = async () => {
    if (form.username === '' || form.email === '' || form.password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 h-full bg-primary-custom-lightpink" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {/* over empty section here i intent to put pixel art stuff like characters hanging over*/}
      </View>

      {/* main container for sign up page with curvy purple design */}
      <View className=" bg-primary-custom-purple rounded-t-[30px] min-h-[80%]">
        <View className="pt-16">
          <Text className="mb-4 text-center font-extrabold text-white text-3xl">
            CREATE AN <Text className="text-primary-custom-pink">ACCOUNT</Text>
          </Text>
        </View>

        {/* form fields for registering */}

        <View className="flex-1 px-12 pt-10">
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            iconName="lock-closed-outline"
            secureTextEntry
          />

          {/* custom buttons for registering */}

          <CustomButton
            variant="outline"
            label={isSubmitting ? 'Creating...' : 'Register'}
            fontSize={20}
            fontFamily="BhalooBold"
            onPress={submit}
            width={280}
            style={{ alignSelf: 'center', marginTop: 30, marginBottom: 30 }}
          ></CustomButton>

          {/* horizontal line divider */}

          <View className="w-full h-[1px] bg-gray-300 my-6" />

          {/* oAuth google and apple sign up custom buttons*/}
          <View className="gap-y-4 items-center">
            <CustomButton variant="solid" label="Sign Up With Google" fontSize={18} iconName="google"></CustomButton>

            <CustomButton
              variant="solid"
              label="Sign Up With Apple"
              fontSize={18}
              backgroundColor="#000"
            ></CustomButton>
          </View>

          {/* Go to sign in page if they have acc*/}

          <View className="flex-row justify-center mt-5">
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text className="text-gray-300 underline font-extrabold text-lg">Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  birthday: {
    flex: 1 / 3,
  },
  withPadding: {
    paddingHorizontal: 16,
  },
});

const scrollViewStyles = [styles.container];
