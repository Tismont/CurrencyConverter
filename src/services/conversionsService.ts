import { supabase } from './supabase';

export type NewConversion = {
  amount: number;
  source_currency: string;
  target_currency: string;
  result: number;
  usd_value: number;
};

export type Conversion = NewConversion & {
  id: string;
  created_at: string;
};

// Inserts a new conversion row into the `conversions` table.
export async function saveConversion(conversion: NewConversion): Promise<void> {
  const { error } = await supabase.from('conversions').insert(conversion);

  if (error) {
    throw new Error(`Failed to save conversion: ${error.message}`);
  }
}

// Returns the total number of conversions stored in the table.
export async function getTotalConversions(): Promise<number> {
  const { count, error } = await supabase
    .from('conversions')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to get total conversions: ${error.message}`);
  }

  return count ?? 0;
}

// Returns the sum of all `usd_value` entries — i.e. total volume converted in USD.
export async function getTotalUsdValue(): Promise<number> {
  const { data, error } = await supabase
    .from('conversions')
    .select('usd_value');

  if (error) {
    throw new Error(`Failed to get total USD value: ${error.message}`);
  }

  return data.reduce((sum, row) => sum + row.usd_value, 0);
}

// Returns the target currency that has been used the most across all conversions.
export async function getMostUsedTargetCurrency(): Promise<string | null> {
  const { data, error } = await supabase
    .from('conversions')
    .select('target_currency');

  if (error) {
    throw new Error(
      `Failed to get most used target currency: ${error.message}`,
    );
  }

  if (!data || data.length === 0) return null;

  const frequency: Record<string, number> = {};
  for (const row of data) {
    frequency[row.target_currency] = (frequency[row.target_currency] ?? 0) + 1;
  }

  return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];
}
