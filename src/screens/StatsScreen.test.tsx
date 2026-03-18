import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import StatsScreen from './StatsScreen';

import {
  getTotalConversions,
  getTotalUsdValue,
  getMostUsedTargetCurrency,
} from '../services/conversionsService';

jest.mock('../services/conversionsService', () => ({
  getTotalConversions: jest.fn(),
  getTotalUsdValue: jest.fn(),
  getMostUsedTargetCurrency: jest.fn(),
}));

const mockGetTotalConversions = getTotalConversions;
const mockGetTotalUsdValue = getTotalUsdValue;
const mockGetMostUsedTargetCurrency = getMostUsedTargetCurrency;

test('shows stats cards after loading', async () => {
  (mockGetTotalConversions as jest.Mock).mockResolvedValue(10);
  (mockGetTotalUsdValue as jest.Mock).mockResolvedValue(2500);
  (mockGetMostUsedTargetCurrency as jest.Mock).mockResolvedValue('EUR');

  const { getByText } = render(<StatsScreen />);

  await waitFor(() => {
    expect(getByText('Total conversions')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();

    expect(getByText('Total volume (USD)')).toBeTruthy();
    expect(getByText('$2,500.00')).toBeTruthy();

    expect(getByText('Most used target currency')).toBeTruthy();
    expect(getByText('EUR')).toBeTruthy();
  });
});
