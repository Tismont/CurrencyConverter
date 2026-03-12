import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../theme/colors';

type InputProps = TextInputProps;

export default function Input({ style, ...rest }: InputProps) {
  return (
    <TextInput
      placeholderTextColor={COLORS.greyLight}
      keyboardType="numeric"
      style={[styles.input, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.greyDark,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
});
