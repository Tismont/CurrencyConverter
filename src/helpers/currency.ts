export function convertCurrency(
  amount: number,
  rateFrom: number,
  rateTo: number,
) {
  const converted = amount * (rateTo / rateFrom);
  const usdValue = amount / rateFrom;

  return {
    converted,
    usdValue,
  };
}

export function isValidAmount(value: string) {
  const parsed = parseFloat(value);
  return !isNaN(parsed) && parsed > 0;
}

export function mapCurrenciesToOptions(currencies: Record<string, string>) {
  return Object.entries(currencies).map(([code, name]) => ({
    label: `${code} – ${name}`,
    value: code,
  }));
}
