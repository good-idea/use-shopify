import { useContext } from 'react'
import { ShopifyContext } from './Provider'

export const useCheckout = () => {
  const ctx = useContext(ShopifyContext)
  if (!ctx)
    throw new Error(
      `useCheckout was called outside of a provider. Be sure to include a ShopifyProvider higher up in your App's component tree.`,
    )
  return ctx.checkout
}

export const useSearch = () => {
  const ctx = useContext(ShopifyContext)
  if (!ctx)
    throw new Error(
      `useCheckout was called outside of a provider. Be sure to include a ShopifyProvider higher up in your App's component tree.`,
    )
  return ctx.search
}
