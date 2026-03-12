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
            <ActivityIndicator size="large" color={PURPLE} />
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
              icon={<RefreshCw size={32} color={PURPLE} />}
            />

            <StatCard
              label="Total volume (USD)"
              value={`$${stats.totalUsdValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={<DollarSign size={32} color={PURPLE} />}
            />

            <StatCard
              label="Most used target currency"
              value={stats.mostUsedTargetCurrency ?? '—'}
              icon={<Trophy size={32} color={PURPLE} />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
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
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#B91C1C',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE_PALE,
    borderRadius: 14,
    padding: 20,
    gap: 16,
    shadowColor: PURPLE,
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
    color: PURPLE_LIGHT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: PURPLE,
  },
});
