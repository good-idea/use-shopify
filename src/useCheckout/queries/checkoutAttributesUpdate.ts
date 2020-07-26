import gql from 'graphql-tag'
import { CheckoutResponse } from '../../types'
import { checkoutFragment } from '../../graphql'

export const CHECKOUT_ATTRIBUTES_UPDATE = gql`
  mutation AddNote($checkoutId: ID!, $input: CheckoutAttributesUdpateV2Input!) {
    checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
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

interface CustomAttribute {
  key: string
  value: string
}

export interface CheckoutAttributesUpdateV2Input {
  allowPartialAddresses?: boolean
  customAttributes?: CustomAttribute[]
  note?: string
}

export interface CheckoutAttributesUpdateArgs {
  checkoutId: string
  input: CheckoutAttributesUpdateV2Input
}

export type CheckoutAttributesUpdateResponse = CheckoutResponse<
  'checkoutAttributesUpdateV2'
>
