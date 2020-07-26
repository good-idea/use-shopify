import gql from 'graphql-tag'
import { CheckoutResponse, CheckoutLineItemUpdateInput } from '../../types'
import { checkoutFragment } from '../../graphql'

export interface CheckoutLineItemsUpdateInput {
  checkoutId: string
  lineItems: CheckoutLineItemUpdateInput[]
}

export type CheckoutLineItemsUpdateResponse = CheckoutResponse<
  'checkoutLineItemsUpdate'
>

export const CHECKOUT_LINE_ITEMS_UPDATE = gql`
  mutation CheckoutLineItemsUpdate(
    $checkoutId: ID!
    $lineItems: [CheckoutLineItemUpdateInput!]!
  ) {
    checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
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
