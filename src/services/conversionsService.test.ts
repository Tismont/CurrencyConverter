import {
  saveConversion,
  getTotalConversions,
  getTotalUsdValue,
  getMostUsedTargetCurrency,
} from './conversionsService';
import { supabase } from './supabase';

jest.mock('./supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockFrom = supabase.from as jest.Mock;

/**
 * Builds a chainable Supabase query mock that resolves to the given result
 * at the terminal method. Each intermediate method returns `this` so the
 * fluent chain works regardless of the number of chained calls.
 */
function mockChain(terminalMethod: string, result: object) {
  const chain: Record<string, jest.Mock> = {};
  const methods = ['select', 'insert', 'eq', 'order', 'limit'];

  for (const method of methods) {
    chain[method] = jest.fn(() =>
      method === terminalMethod ? Promise.resolve(result) : chain,
    );
  }

  mockFrom.mockReturnValue(chain);
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── saveConversion ───────────────────────────────────────────────────────────

describe('saveConversion', () => {
  const payload = {
    amount: 100,
    source_currency: 'USD',
    target_currency: 'EUR',
    result: 92,
    usd_value: 100,
  };

  test('calls supabase.from with the conversions table', async () => {
    mockChain('insert', { error: null });

    await saveConversion(payload);

    expect(mockFrom).toHaveBeenCalledWith('conversions');
  });

  test('inserts the correct payload', async () => {
    const chain = mockChain('insert', { error: null });

    await saveConversion(payload);

    expect(chain.insert).toHaveBeenCalledWith(payload);
  });

  test('throws when Supabase returns an error', async () => {
    mockChain('insert', { error: { message: 'insert failed' } });

    await expect(saveConversion(payload)).rejects.toThrow(
      'Failed to save conversion: insert failed',
    );
  });
});

// ─── getTotalConversions ──────────────────────────────────────────────────────

describe('getTotalConversions', () => {
  test('returns the count from Supabase', async () => {
    mockChain('select', { count: 42, error: null });

    const result = await getTotalConversions();

    expect(result).toBe(42);
  });

  test('returns 0 when count is null', async () => {
    mockChain('select', { count: null, error: null });

    const result = await getTotalConversions();

    expect(result).toBe(0);
  });

  test('throws when Supabase returns an error', async () => {
    mockChain('select', { count: null, error: { message: 'select failed' } });

    await expect(getTotalConversions()).rejects.toThrow(
      'Failed to get total conversions: select failed',
    );
  });
});

// ─── getTotalUsdValue ─────────────────────────────────────────────────────────

describe('getTotalUsdValue', () => {
  test('returns the sum of all usd_value entries', async () => {
    mockChain('select', {
      data: [{ usd_value: 100 }, { usd_value: 250.5 }, { usd_value: 49.5 }],
      error: null,
    });

    const result = await getTotalUsdValue();

    expect(result).toBe(400);
  });

  test('returns 0 when there are no rows', async () => {
    mockChain('select', { data: [], error: null });

    const result = await getTotalUsdValue();

    expect(result).toBe(0);
  });

  test('throws when Supabase returns an error', async () => {
    mockChain('select', { data: null, error: { message: 'select failed' } });

    await expect(getTotalUsdValue()).rejects.toThrow(
      'Failed to get total USD value: select failed',
    );
  });
});

// ─── getMostUsedTargetCurrency ────────────────────────────────────────────────

describe('getMostUsedTargetCurrency', () => {
  test('returns the most frequently used target currency', async () => {
    mockChain('select', {
      data: [
        { target_currency: 'EUR' },
        { target_currency: 'CZK' },
        { target_currency: 'EUR' },
        { target_currency: 'EUR' },
        { target_currency: 'CZK' },
      ],
      error: null,
    });

    const result = await getMostUsedTargetCurrency();

    expect(result).toBe('EUR');
  });

  test('returns null when the table is empty', async () => {
    mockChain('select', { data: [], error: null });

    const result = await getMostUsedTargetCurrency();

    expect(result).toBeNull();
  });

  test('returns the only currency when all rows use the same one', async () => {
    mockChain('select', {
      data: [{ target_currency: 'USD' }, { target_currency: 'USD' }],
      error: null,
    });

    const result = await getMostUsedTargetCurrency();

    expect(result).toBe('USD');
  });

  test('throws when Supabase returns an error', async () => {
    mockChain('select', { data: null, error: { message: 'select failed' } });

    await expect(getMostUsedTargetCurrency()).rejects.toThrow(
      'Failed to get most used target currency: select failed',
    );
  });
});
