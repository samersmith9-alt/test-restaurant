"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CurrencyCode = "USD" | "SYP";

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceUsd: number, priceSyp: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const stored = localStorage.getItem("currency") as CurrencyCode;
    if (stored === "USD" || stored === "SYP") {
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  }, []);

  const formatPrice = useCallback(
    (priceUsd: number, priceSyp: number): string => {
      if (currency === "SYP") {
        return `${priceSyp.toLocaleString()} SYP`;
      }
      return `$${priceUsd.toFixed(2)}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
