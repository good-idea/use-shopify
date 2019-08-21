import * as React from 'react'
import { useCheckout, UseCheckoutValues, UseCheckoutQueries } from '../useCheckout'
import { useSearch, UseSearchValues } from '../useSearch'

interface ShopifyContextValue {
	checkout: UseCheckoutValues
}

export const ShopifyContext = React.createContext<ShopifyContextValue | undefined>(undefined)

export const ShopifyConsumer = ShopifyContext.Consumer

export const useShopify = () => {
	const ctx = React.useContext(ShopifyContext)
	if (!ctx) throw new Error('`useShopify` must be used within a ShopifyProvider')
	return ctx
}

interface Props {
	children: React.ReactNode
	queries: UseCheckoutQueries
}

export const ShopifyProvider = ({ children, queries }: Props) => {
	const checkout = useCheckout(queries)
	const search = useSearch(queries)
	const value = {
		checkout,
		search,
	}

	return <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>
}
