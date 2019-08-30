import { CheckoutResponse, CheckoutLineItemUpdateInput } from '../../types'
import { checkoutFields } from '../../graphql/fragments'

export interface CheckoutLineItemsUpdateInput {
	checkoutId: string
	lineItems: CheckoutLineItemUpdateInput[]
}

export type CheckoutLineItemsUpdateResponse = CheckoutResponse<'checkoutLineItemsUpdate'>

export const CHECKOUT_LINE_ITEMS_UPDATE = /* GraphQL */ `
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
