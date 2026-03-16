import React, { createContext, useContext, useState, useCallback } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$',   label: 'USD', rate: 1.00 },
  { code: 'EUR', symbol: '€',   label: 'EUR', rate: 0.92 },
  { code: 'GBP', symbol: '£',   label: 'GBP', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', label: 'CAD', rate: 1.36 },
];

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const formatPrice = useCallback(
    (usdAmount) => {
      const converted = usdAmount * currency.rate;
      return `${currency.symbol}${converted.toFixed(2)}`;
    },
    [currency],
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
};
