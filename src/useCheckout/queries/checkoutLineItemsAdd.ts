import gql from 'graphql-tag'
import { CheckoutResponse, CheckoutLineItemInput } from '../../types'
import { checkoutFragment } from '../../graphql'

export interface CheckoutLineItemsAddInput {
  checkoutId: string
  lineItems: CheckoutLineItemInput[]
}

export type CheckoutLineItemsAddResponse = CheckoutResponse<
  'checkoutLineItemsAdd'
>

export const CHECKOUT_LINE_ITEMS_ADD = gql`
  mutation CheckoutLineItemsAdd(
    $checkoutId: ID!
    $lineItems: [CheckoutLineItemInput!]!
  ) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
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
