import { CheckoutResponse, CheckoutLineItemInput } from './sharedTypes'
import { checkoutFields } from '../fragments'

export type CheckoutLineItemsAdd = (input: CheckoutLineItemsAddInput) => CheckoutLineItemsAddResponse

export interface CheckoutLineItemsAddInput {
	checkoutId: string
	lineItems: CheckoutLineItemInput[]
}

export type CheckoutLineItemsAddResponse = CheckoutResponse<'checkoutLineItemsAdd'>

export const ADD_ITEM_MUTATION = /* GraphQL */ `
	mutation CheckoutLineItemsAdd(
		$checkoutId: ID!
		$lineItems: [CheckoutLineItemInput!]!
	) {
		checkoutLineItemsAdd(
      checkoutId: $checkoutId
			lineItems: $lineItems
		) {
			checkoutUserErrors {
				code
				field
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}
`
