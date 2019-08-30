import { CheckoutResponse, CheckoutLineItemInput } from '../../types'
import { checkoutFields } from '../../graphql'

export interface CheckoutLineItemsAddInput {
  checkoutId: string
  lineItems: CheckoutLineItemInput[]
}

export type CheckoutLineItemsAddResponse = CheckoutResponse<
  'checkoutLineItemsAdd'
>

export const CHECKOUT_LINE_ITEMS_ADD = /* GraphQL */ `
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
