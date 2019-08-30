import { Checkout } from '../../types'
import { checkoutFields } from '../../graphql'

export interface CheckoutFetchInput {
  id: string
}

export interface CheckoutFetchResponse {
  node: Checkout
}

export const CHECKOUT_FETCH = /* GraphQL */ `
  query CheckoutQuery($id: ID!) {
    node (id: $id) {
      id
      ... on Checkout {
        ${checkoutFields}
      }
    }
  }
`
