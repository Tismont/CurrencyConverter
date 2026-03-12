import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS } from '../theme/colors';

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export default function Button({
  label,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      {...rest}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.purple,
    borderRadius: 6,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 60,
  },
  buttonDisabled: {
    backgroundColor: COLORS.purpleDisabled,
  },
  label: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
