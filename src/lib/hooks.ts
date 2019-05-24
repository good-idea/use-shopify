import { useContext } from 'react';
import { ShopifyContext } from './Provider';

export const useCheckout = () => {
  const { checkout } = useContext(ShopifyContext);
  return checkout;
};

// export const useFetchProductByHandle = () => {
// 	const { fetchProductByHandle } = useContext(ShopifyContext)
// 	return fetchProductByHandle
// }
