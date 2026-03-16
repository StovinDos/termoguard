import React, { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  USD: { symbol: '$',  rate: 1,      label: 'USD — US Dollar' },
  EUR: { symbol: '€',  rate: 0.92,   label: 'EUR — Euro' },
  GBP: { symbol: '£',  rate: 0.79,   label: 'GBP — British Pound' },
  BGN: { symbol: 'лв', rate: 1.80,   label: 'BGN — Bulgarian Lev' },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  const convert = useCallback((usdPrice) => {
    const rate = CURRENCIES[currency].rate;
    return (usdPrice * rate).toFixed(2);
  }, [currency]);

  const format = useCallback((usdPrice) => {
    const { symbol } = CURRENCIES[currency];
    const amount = convert(usdPrice);
    // BGN goes after the number
    if (currency === 'BGN') return `${amount} ${symbol}`;
    return `${symbol}${amount}`;
  }, [currency, convert]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
};
