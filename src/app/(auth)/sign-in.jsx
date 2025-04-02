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
import { signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { toast } from 'sonner-native';
import COLORS from '@/utils/color';

const SignIn = () => {
  const { setIsLogged, setUser } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const submit = async () => {
    if (form.email === '' || form.password === '') {
      toast.warning('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password, setUser);
      setIsLogged(true);
      toast.success('Signed in successfully');
      router.replace('/home');
    } catch (error) {
      console.error('error from sign in' + error);
      toast.error('No user found');
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
          <View className="flex-1">
            {/* over empty section here i intent to put pixel art stuff like characters hanging over*/}
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="rounded-t-[30px]">
            <View style={{ backgroundColor: COLORS.lightpink }} className=" rounded-t-[30px] min-h-[80%]">
              <View className="pt-16">
                <Text
                  style={{ fontFamily: 'PixelCodeBold', color: COLORS.purple }}
                  className="mb-4 text-center text-3xl"
                >
                  HEY,<Text className="text-black">WELCOME BACK!</Text>
                </Text>
              </View>

              <View className="flex-1 px-12 pt-10">
                <FormField
                  title="Email or Username"
                  value={form.email}
                  handleChangeText={(e) => setForm({ ...form, email: e })}
                  placeholder="enter it here"
                />
                <FormField
                  title="Enter your password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  placeholder="password"
                  secureTextEntry
                />
                {/* <TouchableOpacity className="mb-1 items-center" onPress={() => router.push('/forgot-password')}>
                  <Text style={{ fontFamily: 'PixelCode' }} className="text-[#218CFF] underline">
                    Forgot password?
                  </Text>
                </TouchableOpacity> */}

                <CustomButton
                  variant="outline"
                  label={isSubmitting ? 'Signing in...' : 'Log In'}
                  fontSize={20}
                  fontFamily="PixelCodeBold"
                  onPress={submit}
                  width={280}
                  style={{ alignSelf: 'center', marginTop: 30, marginBottom: 30, color: '#000' }}
                  disabled={isSubmitting}
                ></CustomButton>

                <View style={{ backgroundColor: COLORS.green }} className="w-full h-4 rounded-xl border-4 my-6" />

                {/* <View className="gap-y-4 items-center">
                  <CustomButton
                    variant="solid"
                    label="Sign Up With Apple"
                    fontSize={16}
                    color={'white'}
                    fontFamily="ReadexProBold"
                    backgroundColor="#000"
                  ></CustomButton>
                </View> */}

                <View className="flex-row justify-center mt-5">
                  <TouchableOpacity onPress={() => router.replace('/sign-up')}>
                    <Text style={{ fontFamily: 'PixelCodeBold' }} className="text-gray-500 underline text-lg">
                      Create an account?
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignIn;
