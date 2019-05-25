import * as React from 'react'
import { useCheckout, UseCheckoutQueries } from '../useCheckout'

interface ShopifyContextValue {
	checkout: any
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
	const value = {
		checkout,
	}

	return <ShopifyContext.Provider value={value}>{children}</ShopifyContext.Provider>
}
