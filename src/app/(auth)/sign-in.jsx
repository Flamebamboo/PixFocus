import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "@/components/Onboarding/CustomButton";
import { router } from "expo-router";
import { signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { toast } from "sonner-native";

const SignIn = () => {
  const { setIsLogged, setUser } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "iphone12",
    password: "admin2025!*",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      toast.warning("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password, setUser);
      setIsLogged(true);
      toast.success("Signed in successfully");
      router.replace("/home");
    } catch (error) {
      console.error("error from sign in" + error);
      toast.error("No user found");
    } finally {
      setSubmitting(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 w-full bg-primary-purple" edges={["top", "left", "right"]}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1">
          <View className="flex-1">
            {/* over empty section here i intent to put pixel art stuff like characters hanging over*/}
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="bg-primary-custom-purple rounded-t-[30px]"
          >
            <View className=" bg-primary-lightpink rounded-t-[30px] min-h-[80%]">
              <View className="pt-16">
                <Text className="mb-4 font-ReadexProBold text-center  text-primary-purple text-3xl">
                  HEY, <Text className="text-black"> WELCOME BACK!</Text>
                </Text>
              </View>

              <View className="flex-1 px-12 pt-10">
                <FormField
                  title="Email or Username"
                  value={form.email}
                  handleChangeText={(e) => setForm({ ...form, email: e })}
                  placeholder="Enter your email or username"
                />
                <FormField
                  title="Enter your password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  placeholder="password"
                  secureTextEntry
                />
                <TouchableOpacity className="mb-1 items-center" onPress={() => console.log("Forgot password pressed")}>
                  <Text className="text-[#218CFF] underline font-ReadexProSemiBold">Forgot password?</Text>
                </TouchableOpacity>

                <CustomButton
                  variant="outline"
                  label={isSubmitting ? "Signing in..." : "Log In"}
                  fontSize={20}
                  fontFamily="ReadexProBold"
                  onPress={submit}
                  width={280}
                  style={{ alignSelf: "center", marginTop: 30, marginBottom: 30, color: "#000" }}
                  disabled={isSubmitting}
                ></CustomButton>

                <View className="w-full h-4 rounded-xl bg-primary-green border-4 my-6" />

                <View className="gap-y-4 items-center">
                  <CustomButton
                    variant="solid"
                    label="Sign Up With Apple"
                    fontSize={16}
                    color={"white"}
                    fontFamily="ReadexProBold"
                    backgroundColor="#000"
                  ></CustomButton>
                </View>

                <View className="flex-row justify-center mt-5">
                  <TouchableOpacity onPress={() => router.replace("/sign-up")}>
                    <Text className="text-gray-500 underline font-extrabold text-lg">Create an account?</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignIn;
