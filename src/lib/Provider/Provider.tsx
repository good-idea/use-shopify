import * as React from 'react';
import { Client, createClient, Provider as UrqlProvider } from 'urql';

interface ShopifyContextValue {
  client: Client;
}

const ShopifyContext = React.createContext<Partial<ShopifyContextValue>>({});

export const ShopifyConsumer = ShopifyContext.Consumer;

export const useShopify = () => React.useContext(ShopifyContext);

interface Props {
  children: React.ReactNode;
  storefrontAccessToken: string;
  storefrontName: string;
  endpoint?: string;
}

export const ShopifyProvider = ({
  children,
  storefrontAccessToken,
  storefrontName,
  endpoint
}: Props) => {
  const url = endpoint || `https://${storefrontName}.myshopify.com/api/graphql`;
  const client = createClient({
    url,
    fetchOptions: {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      }
    }
  });

  const value = {
    client
  };

  return (
    <UrqlProvider value={client}>
      <ShopifyContext.Provider value={value}>
        {children}
      </ShopifyContext.Provider>
    </UrqlProvider>
  );
};
