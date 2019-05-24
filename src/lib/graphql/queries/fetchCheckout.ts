import { Checkout } from '../../types';
import { checkoutFields } from '../fragments';

export type FetchCheckout = (
  input: FetchCheckoutInput
) => Promise<{
  data: {
    node: Checkout;
  };
}>;

interface FetchCheckoutInput {
  id: string;
}

export const FETCH_CHECKOUT_QUERY = /* GraphQL */ `
  query CheckoutQuery($id: ID!) {
    node (id: $id) {
      id
      ... on Checkout {
        ${checkoutFields}
      }
    }
  }
`;
