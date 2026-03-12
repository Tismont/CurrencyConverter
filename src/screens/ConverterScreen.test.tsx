import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ConverterScreen from './ConverterScreen';

import { fetchRates, fetchCurrencies } from '../services/exchangeApi';
import {
  getTotalConversions,
  saveConversion,
} from '../services/conversionsService';

jest.mock('../services/exchangeApi', () => ({
  fetchRates: jest.fn(),
  fetchCurrencies: jest.fn(),
}));

jest.mock('../services/conversionsService', () => ({
  getTotalConversions: jest.fn(),
  saveConversion: jest.fn(),
}));

jest.mock('react-native-element-dropdown', () => {
  const { View } = require('react-native');
  return {
    Dropdown: View,
  };
});

const mockFetchRates = fetchRates as jest.Mock;
const mockFetchCurrencies = fetchCurrencies as jest.Mock;
const mockGetTotalConversions = getTotalConversions as jest.Mock;
const mockSaveConversion = saveConversion as jest.Mock;

const DEFAULT_RATES = { USD: 1, EUR: 0.92, CZK: 23.5 };
const DEFAULT_CURRENCIES = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  CZK: 'Czech Koruna',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchRates.mockResolvedValue(DEFAULT_RATES);
  mockFetchCurrencies.mockResolvedValue(DEFAULT_CURRENCIES);
  mockGetTotalConversions.mockResolvedValue(5);
  mockSaveConversion.mockResolvedValue(undefined);
});

test('shows loading spinner while fetching data', () => {
  // Return a promise that never resolves so the screen stays in loading state
  mockFetchRates.mockReturnValue(new Promise(() => {}));

  const { getByText } = render(<ConverterScreen />);

  expect(getByText('Loading currencies…')).toBeTruthy();
});

test('shows the form after data has loaded', async () => {
  const { getByText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(getByText('Amount to convert')).toBeTruthy();
    expect(getByText('From')).toBeTruthy();
    expect(getByText('To')).toBeTruthy();
    expect(getByText('Convert currency')).toBeTruthy();
  });
});

test('shows error message when data fetching fails', async () => {
  mockFetchRates.mockRejectedValue(new Error('Network error'));

  const { getByText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(
      getByText('Failed to load exchange rates. Please try again.'),
    ).toBeTruthy();
  });
});

test('shows result card after pressing Convert currency', async () => {
  mockGetTotalConversions
    .mockResolvedValueOnce(5) // initial load
    .mockResolvedValueOnce(6); // after conversion

  const { getByText, getByPlaceholderText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(getByText('Convert currency')).toBeTruthy();
  });

  fireEvent.changeText(getByPlaceholderText('Enter amount'), '100');
  fireEvent.press(getByText('Convert currency'));

  await waitFor(() => {
    expect(getByText('Result')).toBeTruthy();
  });
});

test('calls saveConversion with correct values after converting', async () => {
  const { getByText, getByPlaceholderText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(getByText('Convert currency')).toBeTruthy();
  });

  fireEvent.changeText(getByPlaceholderText('Enter amount'), '100');
  fireEvent.press(getByText('Convert currency'));

  await waitFor(() => {
    expect(mockSaveConversion).toHaveBeenCalledTimes(1);
    expect(mockSaveConversion).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        source_currency: 'USD',
        target_currency: 'EUR',
      }),
    );
  });
});

test('updates the total conversion count after converting', async () => {
  mockGetTotalConversions
    .mockResolvedValueOnce(5) // initial load
    .mockResolvedValueOnce(6); // after conversion

  const { getByText, getByPlaceholderText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(getByText('Convert currency')).toBeTruthy();
  });

  fireEvent.changeText(getByPlaceholderText('Enter amount'), '100');
  fireEvent.press(getByText('Convert currency'));

  await waitFor(() => {
    expect(getByText('6')).toBeTruthy();
  });
});

test('does not call saveConversion when amount is empty', async () => {
  const { getByText } = render(<ConverterScreen />);

  await waitFor(() => {
    expect(getByText('Convert currency')).toBeTruthy();
  });

  fireEvent.press(getByText('Convert currency'));

  await waitFor(() => {
    expect(mockSaveConversion).not.toHaveBeenCalled();
  });
});
