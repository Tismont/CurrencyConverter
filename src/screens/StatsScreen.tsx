import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getTotalConversions,
  getTotalUsdValue,
  getMostUsedTargetCurrency,
} from '../services/conversionsService';
import { DollarSign, RefreshCw, Trophy } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import StatCard from '../components/StatCard';

type Stats = {
  totalConversions: number;
  totalUsdValue: number;
  mostUsedTargetCurrency: string | null;
};

export default function StatsScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [totalConversions, totalUsdValue, mostUsedTargetCurrency] =
        await Promise.all([
          getTotalConversions(),
          getTotalUsdValue(),
          getMostUsedTargetCurrency(),
        ]);

      setStats({ totalConversions, totalUsdValue, mostUsedTargetCurrency });
    } catch {
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={COLORS.purple} />
            <Text style={styles.statusText}>Loading statistics…</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && stats && (
          <View style={styles.cardsContainer}>
            <StatCard
              label="Total conversions"
              value={String(stats.totalConversions)}
              icon={<RefreshCw size={32} color={COLORS.purple} />}
            />

            <StatCard
              label="Total volume (USD)"
              value={`$${stats.totalUsdValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={<DollarSign size={32} color={COLORS.purple} />}
            />

            <StatCard
              label="Most used target currency"
              value={stats.mostUsedTargetCurrency ?? '—'}
              icon={<Trophy size={32} color={COLORS.purple} />}
            />
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
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
  },
});
