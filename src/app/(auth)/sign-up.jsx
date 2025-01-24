import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import FormField from '../../components/FormField';
import CustomButton from '@/components/Onboarding/CustomButton';
import { router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { toast } from 'sonner-native';
import { validateEmail, validatePassword } from '../../utils/passwordValidation';

import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

const SignUp = () => {
  const { setIsLogged, setUser } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    if (form.username === '' || form.email === '' || form.password === '') {
      toast.error('Please fill in all fields');
      return false;
    }

    if (!validateEmail(form.email)) {
      toast.error('Please enter a valid email');
      return false;
    }

    if (!validatePassword(form.password)) {
      toast.error(
        'Password must be at least 8 characters and include 3 of the following: uppercase letter, number, special character'
      );
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username, setUser);
      setIsLogged(true);
      router.replace('/home');
    } catch (error) {
      console.error('Sign up error:', error);
      // Handle specific duplicate errors
      if (error.message.includes('Email is already registered')) {
        toast.error('This email is already registered');
      } else if (error.message.includes('Username is already taken')) {
        toast.error('This username is already taken');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 h-full bg-primary-purple" edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1">
          <View className="flex-1">{/* Pixel art placeholder */}</View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="bg-primary-lightpink rounded-t-[30px]"
          >
            <ScrollView className="min-h-[80%]" showsVerticalScrollIndicator={false} bounces={false}>
              <View className="pt-16">
                <Text className="mb-4 text-center font-extrabold text-black text-3xl">
                  CREATE AN <Text className="text-primary-purple">ACCOUNT</Text>
                </Text>
              </View>

              <View className="px-12 pt-10 pb-8">
                {/* Form fields */}
                <FormField
                  title="Username"
                  value={form.username}
                  placeholder="Enter your username"
                  handleChangeText={(e) => setForm({ ...form, username: e })}
                  keyboardType="default"
                />
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

                <PasswordStrengthIndicator password={form.password} />

                <CustomButton
                  variant="outline"
                  label={isSubmitting ? 'Creating...' : 'Register'}
                  fontSize={20}
                  fontFamily="ReadexProBold"
                  onPress={submit}
                  width={280}
                  style={{ alignSelf: 'center', marginTop: 30, marginBottom: 30, color: '#000' }}
                />

                <View className="w-full h-4 rounded-xl bg-primary-green border-4 my-6" />

                <View className="gap-y-4 items-center">
                  <View className="gap-y-4 items-center">
                    <CustomButton
                      variant="solid"
                      label="Sign Up With Apple"
                      fontSize={16}
                      color={'white'}
                      fontFamily="ReadexProBold"
                      backgroundColor="#000"
                    ></CustomButton>
                  </View>
                </View>

                <View className="flex-row justify-center mt-5 mb-3">
                  <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                    <Text className="text-gray-500 underline font-extrabold text-lg">Already have an account?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUp;
