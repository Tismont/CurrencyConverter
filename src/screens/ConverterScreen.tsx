import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchRates, fetchCurrencies } from '../services/exchangeApi';
import {
  getTotalConversions,
  saveConversion,
} from '../services/conversionsService';
import { COLORS } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { ArrowUpDown } from 'lucide-react-native';

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

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={COLORS.purple} />
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
            <Input
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Text style={styles.label}>From</Text>

            <Select
              data={currencyOptions}
              value={fromCurrency}
              onChange={(item) => setFromCurrency(item.value)}
            />

            <TouchableOpacity
              style={styles.swapButton}
              onPress={swapCurrencies}
              accessibilityLabel="Swap currencies"
            >
              <ArrowUpDown size={18} color={COLORS.white} />
            </TouchableOpacity>

            <Text style={styles.label}>To</Text>

            <Select
              data={currencyOptions}
              value={toCurrency}
              onChange={(item) => setToCurrency(item.value)}
            />
          </View>
        )}

        {!loading && !error && (
          <Button
            label="Convert currency"
            onPress={handleConvert}
            disabled={isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.purple,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  select: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  swapButton: {
    alignSelf: 'center',
    borderRadius: 20,
    padding: 8,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.purple,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.purplePale,
    marginBottom: 14,
  },
  calculationText: {
    fontSize: 14,
    color: COLORS.greyLight,
  },
  calculationCount: {
    fontWeight: '700',
    color: COLORS.purpleLight,
  },

  statusContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 16,
  },
  statusText: {
    fontSize: 15,
    color: COLORS.purple,
  },
  errorContainer: {
    backgroundColor: COLORS.errorBg,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
});
