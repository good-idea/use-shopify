// import { CheckoutResponse, CheckoutLineItemInput } from './sharedTypes';
import { CheckoutResponse, CheckoutLineItemInput } from './sharedTypes'

import { checkoutFields } from '../fragments'

export type CheckoutLineItemsUpdate = (input: CheckoutLineItemsUpdateInput) => CheckoutLineItemsUpdateResponse

export interface CheckoutLineItemsUpdateInput {
	checkoutId: string
	lineItems: CheckoutLineItemInput[]
}

export type CheckoutLineItemsUpdateResponse = CheckoutResponse<'checkoutLineItemsUpdate'>

export const UPDATE_ITEM_MUTATION = /* GraphQL */ `
	mutation CheckoutLineItemsUpdate(
		$checkoutId: ID!,
    $lineItems: [CheckoutLineItemUpdateInput!]!
	) {
		checkoutLineItemsUpdate(
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
