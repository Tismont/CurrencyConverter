import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>{icon}</View>
      <View style={styles.cardBody}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purplePale,
    borderRadius: 14,
    padding: 20,
    gap: 16,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.purpleLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.purple,
  },
});
