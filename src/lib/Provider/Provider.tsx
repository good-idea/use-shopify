import * as React from 'react';
import { useCheckout } from '../useCheckout';

interface ShopifyContextValue {
  checkout: any;
}

export const ShopifyContext = React.createContext<
  ShopifyContextValue | undefined
>(undefined);

export const ShopifyConsumer = ShopifyContext.Consumer;

export const useShopify = () => {
  const ctx = React.useContext(ShopifyContext);
  if (!ctx)
    throw new Error('`useShopify` must be used within a ShopifyProvider');
  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const ShopifyProvider = ({ children }: Props) => {
  const checkout = useCheckout();
  const value = {
    checkout
  };

  return (
    <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>
  );
};
