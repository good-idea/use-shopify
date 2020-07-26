import gql from 'graphql-tag'
import { CheckoutResponse } from '../../types'
import { checkoutFragment } from '../../graphql'

export interface CheckoutDiscountCodeRemoveInput {
  checkoutId: string
}

export type CheckoutDiscountCodeRemoveResponse = CheckoutResponse<
  'checkoutDiscountCodeRemove'
>

export const CHECKOUT_DISCOUNT_CODE_REMOVE = gql`
  mutation CheckoutDiscountCodeRemove($checkoutId: ID!) {
    checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
      checkoutUserErrors {
        __typename
        code
        field
        message
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }

  ${checkoutFragment}
`
