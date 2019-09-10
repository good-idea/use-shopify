import gql from 'graphql-tag'
import { Checkout } from '../../types'
import { checkoutFragment } from '../../graphql'

export interface CheckoutFetchInput {
  id: string
}

export interface CheckoutFetchResponse {
  node: Checkout
}

export const CHECKOUT_FETCH = gql`
  query CheckoutQuery($id: ID!) {
    node(id: $id) {
      id
      ... on Checkout {
        ...CheckoutFragment
      }
    }
  }
  ${checkoutFragment}
`
