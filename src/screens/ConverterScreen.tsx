import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchRates, fetchCurrencies } from '../services/exchangeApi';
import {
  getTotalConversions,
  saveConversion,
} from '../services/conversionsService';

type CurrencyOption = { label: string; value: string };

export default function ConverterScreen() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [totalConversions, setTotalConversions] = useState<number>(0);

  const [rates, setRates] = useState<Record<string, number>>({});
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ratesData, currenciesData, total] = await Promise.all([
          fetchRates(),
          fetchCurrencies(),
          getTotalConversions(),
        ]);

        setRates(ratesData);
        setTotalConversions(total);

        const options = Object.entries(currenciesData).map(([code, name]) => ({
          label: `${code} – ${name}`,
          value: code,
        }));

        setCurrencyOptions(options);
      } catch (e) {
        setError('Failed to load exchange rates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleConvert = async () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (!rateFrom || !rateTo) return;

    const converted = parsed * (rateTo / rateFrom);
    const usdValue = parsed / rateFrom;

    setResult(Number(converted.toFixed(4)));

    await saveConversion({
      amount: parsed,
      source_currency: fromCurrency,
      target_currency: toCurrency,
      result: converted,
      usd_value: usdValue,
    });

    const total = await getTotalConversions();
    setTotalConversions(total);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Purple currency converter</Text>

        {loading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={PURPLE} />
            <Text style={styles.statusText}>Loading currencies…</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
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
              data={currencyOptions}
              labelField="label"
              valueField="value"
              value={fromCurrency}
              onChange={(item) => setFromCurrency(item.value)}
              search
              searchPlaceholder="Search currency…"
            />

            <Text style={styles.label}>To</Text>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={currencyOptions}
              labelField="label"
              valueField="value"
              value={toCurrency}
              onChange={(item) => setToCurrency(item.value)}
              search
              searchPlaceholder="Search currency…"
            />
          </View>
        )}

        {!loading && !error && (
          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
          >
            <Text style={styles.convertButtonText}>Convert currency</Text>
          </TouchableOpacity>
        )}

        {result !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultValue}>
              {result} {toCurrency}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.calculationText}>
              Number of calculations made:{' '}
              <Text style={styles.calculationCount}>{totalConversions}</Text>
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
    paddingTop: 12,
    paddingHorizontal: 24,
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

  statusContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 16,
  },
  statusText: {
    fontSize: 15,
    color: PURPLE,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
  },
});
