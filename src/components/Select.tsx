import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import { COLORS } from '../theme/colors';

type Item = { label: string; value: string };

type SelectProps = Omit<DropdownProps<Item>, 'labelField' | 'valueField'>;

export default function Select({
  style,
  containerStyle,
  ...rest
}: SelectProps) {
  return (
    <Dropdown
      labelField="label"
      valueField="value"
      search
      autoScroll={false}
      searchPlaceholder="Search currency…"
      style={[styles.dropdown, style]}
      containerStyle={[styles.dropdownContainer, containerStyle]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderRadius: 10,
  },
});
