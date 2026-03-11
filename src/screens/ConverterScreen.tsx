import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'CZK', value: 'CZK' },
];
const x = 0;
const MOCK_RATES: Record<string, Record<string, number>> = {
  USD: { USD: 1, EUR: 0.92, CZK: 23.5 },
  EUR: { USD: 1.09, EUR: 1, CZK: 25.6 },
  CZK: { USD: 0.043, EUR: 0.039, CZK: 1 },
};

export default function ConverterScreen() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [calculationCount, setCalculationCount] = useState<number>(0);

  const handleConvert = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    const rate = MOCK_RATES[fromCurrency]?.[toCurrency] ?? 1;
    setResult(parseFloat((parsed * rate).toFixed(2)));
    setCalculationCount((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Purple currency converter</Text>

        {/* Input card */}
        <View style={styles.card}>
          <Text style={styles.label}>Amount to convert</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#c9aaff"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>From</Text>

          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            data={CURRENCY_OPTIONS}
            labelField="label"
            valueField="value"
            value={fromCurrency}
            onChange={(item) => setFromCurrency(item.value)}
          />

          <Text style={styles.label}>To</Text>

          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            data={CURRENCY_OPTIONS}
            labelField="label"
            valueField="value"
            value={toCurrency}
            onChange={(item) => setToCurrency(item.value)}
          />
        </View>

        <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
          <Text style={styles.convertButtonText}>Convert currency</Text>
        </TouchableOpacity>

        {/* Result card */}
        {result !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultValue}>
              {result} {toCurrency}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.calculationText}>
              Number of calculations made:{' '}
              <Text style={styles.calculationCount}>{calculationCount}</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#4C276F';
const PURPLE_LIGHT = '#9333EA';
const PURPLE_PALE = '#F3E8FF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 12,
  },

  card: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    padding: 20,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    color: '#E9D5FF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  select: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },

  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },

  dropdownContainer: {
    borderRadius: 10,
  },

  pickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  currencyButtonText: {
    color: '#E9D5FF',
    fontWeight: '600',
    fontSize: 15,
  },
  currencyButtonTextActive: {
    color: PURPLE,
  },

  convertButton: {
    backgroundColor: PURPLE,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 60,
  },

  convertButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '800',
    color: PURPLE,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: PURPLE_PALE,
    marginBottom: 14,
  },
  calculationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  calculationCount: {
    fontWeight: '700',
    color: PURPLE_LIGHT,
  },
});
