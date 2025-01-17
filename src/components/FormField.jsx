import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/utils/color';

const FormField = ({ title, value, placeholder, handleChangeText, iconName, secureTextEntry, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text) => {
    // Ensure we're passing a valid string
    const sanitizedText = text || '';
    handleChangeText(sanitizedText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={[styles.inputContainer, isFocused && styles.focusedInput]}>
        {iconName && <Ionicons name={iconName} size={20} color="#9CA3AF" style={styles.icon} />}
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: 'ReadexProBold',
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 16,
    marginTop: 5,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 4,

    flexDirection: 'row',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  focusedInput: {
    borderColor: COLORS.purple,
    borderWidth: 4,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,

    fontFamily: 'ReadexProRegular',
  },
  eyeIcon: {
    padding: 4,
  },
});

export default FormField;
