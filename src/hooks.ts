import { useContext } from 'react'
import { ShopifyContext } from './Provider'

export const useCheckout = () => {
	const { checkout } = useContext(ShopifyContext)
	return checkout
}

export const useSearch = () => {
	const { search } = useContext(ShopifyContext)
	return search
}
