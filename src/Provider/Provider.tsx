import * as React from 'react'
import {
  useCheckout,
  UseCheckoutValues,
  UseCheckoutQueries,
  UseCheckoutConfig,
} from '../useCheckout'
import {
  useSearch,
  UseSearchValues,
  UseSearchQueries,
  UseSearchConfig,
} from '../useSearch'
import { QueryFunction } from '../types'

interface ShopifyContextValue {
  checkout: UseCheckoutValues
  search: UseSearchValues
}

export const ShopifyContext = React.createContext<
  ShopifyContextValue | undefined
>(undefined)

export const ShopifyConsumer = ShopifyContext.Consumer

export const useShopify = () => {
  const ctx = React.useContext(ShopifyContext)
  if (!ctx)
    throw new Error('`useShopify` must be used within a ShopifyProvider')
  return ctx
}

type CustomQueries = Partial<UseCheckoutQueries & UseSearchQueries>

interface Props {
  children: React.ReactNode
  query: QueryFunction
  queries?: CustomQueries
  config?: {
    search: Partial<UseSearchConfig>
    checkout: Partial<UseCheckoutConfig>
  }
}

const defaultConfig = {
  search: undefined,
  checkout: undefined,
}

export const ShopifyProvider = ({
  children,
  queries,
  query,
  config: userConfig,
}: Props) => {
  const config = {
    ...defaultConfig,
    ...userConfig,
  }

  const checkout = useCheckout({
    queries,
    query,
    config: config.checkout ? config.checkout : undefined,
  })

  const search = useSearch({ queries, query, config: config.search })

  const value = {
    checkout,
    search,
  }

  return (
    <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>
  )
}
