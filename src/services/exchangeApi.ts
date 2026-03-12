const API_KEY = process.env.EXPO_PUBLIC_OPEN_EXCHANGE_KEY;
const BASE_URL = 'https://openexchangerates.org/api';

/**
 * Fetches the latest exchange rates from OpenExchangeRates
 * The base currency is always USD
 */
export async function fetchRates(): Promise<Record<string, number>> {
  const response = await fetch(`${BASE_URL}/latest.json?app_id=${API_KEY}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch rates: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.rates;
}

export async function fetchCurrencies(): Promise<Record<string, string>> {
  const response = await fetch(`${BASE_URL}/currencies.json?app_id=${API_KEY}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch currencies: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}
