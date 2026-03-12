import { fetchRates, fetchCurrencies } from './exchangeApi';

const RATES_URL = 'https://openexchangerates.org/api/latest.json';
const CURRENCIES_URL = 'https://openexchangerates.org/api/currencies.json';

let mockFetch: jest.SpyInstance;

beforeEach(() => {
  mockFetch = jest.spyOn(window, 'fetch');
});

afterEach(() => {
  mockFetch.mockRestore();
});

// ─── fetchRates ───────────────────────────────────────────────────────────────

describe('fetchRates', () => {
  test('calls the correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rates: { USD: 1, EUR: 0.92, CZK: 23.5 } }),
    });

    await fetchRates();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain(RATES_URL);
  });

  test('returns the rates object from the response', async () => {
    const mockRates = { USD: 1, EUR: 0.92, CZK: 23.5 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rates: mockRates }),
    });

    const result = await fetchRates();

    expect(result).toEqual(mockRates);
  });

  test('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    await expect(fetchRates()).rejects.toThrow(
      'Failed to fetch rates: 401 Unauthorized',
    );
  });

  test('throws when fetch itself rejects (network failure)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchRates()).rejects.toThrow('Network error');
  });
});

// ─── fetchCurrencies ──────────────────────────────────────────────────────────

describe('fetchCurrencies', () => {
  test('calls the correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ USD: 'United States Dollar', EUR: 'Euro' }),
    });

    await fetchCurrencies();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain(CURRENCIES_URL);
  });

  test('returns the full currencies map from the response', async () => {
    const mockCurrencies = {
      USD: 'United States Dollar',
      EUR: 'Euro',
      CZK: 'Czech Koruna',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCurrencies,
    });

    const result = await fetchCurrencies();

    expect(result).toEqual(mockCurrencies);
  });

  test('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    await expect(fetchCurrencies()).rejects.toThrow(
      'Failed to fetch currencies: 403 Forbidden',
    );
  });

  test('throws when fetch itself rejects (network failure)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCurrencies()).rejects.toThrow('Network error');
  });
});
