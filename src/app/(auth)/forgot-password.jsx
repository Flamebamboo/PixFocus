import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '@/components/Onboarding/CustomButton';
import { router } from 'expo-router';
import { resetPassword } from '../../lib/appwrite';
import { toast } from 'sonner-native';
import COLORS from '@/utils/color';

const ForgotPassword = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (email === '') {
      toast.warning('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      toast.warning('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Please check your inbox.');
      // Wait a moment before navigating back to allow the user to see the success message
      setTimeout(() => {
        router.replace('/sign-in');
      }, 2500);
    } catch (error) {
      console.error('Password reset error:', error);

      if (error.message.includes('Email not found')) {
        toast.error('No account found with this email');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.purple }} className="flex-1 w-full" edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1">
          <View className="flex-1">{/* Pixel art area */}</View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="rounded-t-[30px]">
            <View style={{ backgroundColor: COLORS.lightpink }} className="rounded-t-[30px] min-h-[80%]">
              <View className="pt-16">
                <Text
                  style={{ fontFamily: 'PixelCodeBold', color: COLORS.purple }}
                  className="mb-4 text-center text-3xl"
                >
                  FORGOT<Text className="text-black"> PASSWORD?</Text>
                </Text>
              </View>

              <View className="flex-1 px-12 pt-10">
                <Text style={{ fontFamily: 'PixelCode' }} className="text-center mb-6 text-gray-700">
                  Enter your email address and we'll send you instructions to reset your password
                </Text>

                <FormField
                  title="Email Address"
                  value={email}
                  handleChangeText={setEmail}
                  placeholder="enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <CustomButton
                  variant="outline"
                  label={isSubmitting ? 'Sending...' : 'Reset Password'}
                  fontSize={20}
                  fontFamily="PixelCodeBold"
                  onPress={handleResetPassword}
                  width={280}
                  style={{ alignSelf: 'center', marginTop: 30, marginBottom: 30, color: '#000' }}
                  disabled={isSubmitting}
                />

                <View style={{ backgroundColor: COLORS.green }} className="w-full h-4 rounded-xl border-4 my-6" />

                <View className="flex-row justify-center mt-5">
                  <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                    <Text style={{ fontFamily: 'PixelCodeBold' }} className="text-gray-500 underline text-lg">
                      Back to sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword;
