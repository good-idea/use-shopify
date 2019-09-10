import gql from 'graphql-tag'
import { CheckoutResponse } from '../../types'
import { checkoutFragment } from '../../graphql'

export interface CheckoutDiscountCodeApplyInput {
  checkoutId: string
  discountCode: string
}

export type CheckoutDiscountCodeApplyResponse = CheckoutResponse<
  'checkoutDiscountCodeApplyV2'
>

export const CHECKOUT_DISCOUNT_CODE_APPLY = gql`
  mutation CheckoutDiscountCodeApplyV2(
    $checkoutId: ID!
    $discountCode: String!
  ) {
    checkoutDiscountCodeApplyV2(
      checkoutId: $checkoutId
      discountCode: $discountCode
    ) {
      checkoutUserErrors {
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
