import { CheckoutResponse } from '../../types'
import { checkoutFields } from '../../graphql/fragments'

export interface CheckoutDiscountCodeRemoveInput {
	checkoutId: string
}

export type CheckoutDiscountCodeRemoveResponse = CheckoutResponse<'checkoutDiscountCodeRemove'>

export const CHECKOUT_DISCOUNT_CODE_REMOVE = /* GraphQL */ `
	mutation CheckoutDiscountCodeRemove(
		$checkoutId: ID!
	) {
		checkoutDiscountCodeRemove(
      checkoutId: $checkoutId
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
