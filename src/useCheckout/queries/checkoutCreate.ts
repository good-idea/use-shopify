import gql from 'graphql-tag'
import {
  CheckoutLineItemInput,
  AttributeInput,
  MailingAddressInput,
  CheckoutResponse,
} from '../../types'
import { checkoutFragment } from '../../graphql'

export type CheckoutCreate = (
  input: CheckoutCreateInput,
) => CheckoutCreateResponse

export interface CheckoutCreateInput {
  email?: string
  lineItems?: CheckoutLineItemInput[]
  shippingAddress?: MailingAddressInput
  note?: string
  customAttributes?: AttributeInput[]
  allowPartialAddresses?: boolean
}

export type CheckoutCreateResponse = CheckoutResponse<'checkoutCreate'>

export const CHECKOUT_CREATE = gql`
  mutation CheckoutCreate(
    $email: String
    $lineItems: [CheckoutLineItemInput!]
    $shippingAddress: MailingAddressInput
    $note: String
    $customAttributes: [AttributeInput!]
    $allowPartialAddresses: Boolean
  ) {
    checkoutCreate(
      input: {
        email: $email
        lineItems: $lineItems
        shippingAddress: $shippingAddress
        note: $note
        customAttributes: $customAttributes
        allowPartialAddresses: $allowPartialAddresses
      }
    ) {
      checkoutUserErrors {
        code
        field
      }
      checkout {
        ...CheckoutFragment
      }
    }
  }
  ${checkoutFragment}
`
