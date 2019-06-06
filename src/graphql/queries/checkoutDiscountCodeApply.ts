import { CheckoutResponse } from './sharedTypes'
import { checkoutFields } from '../fragments'

export type CheckoutDiscountCodeApply = (input: CheckoutDiscountCodeApplyInput) => CheckoutDiscountCodeApplyV2Response

export interface CheckoutDiscountCodeApplyInput {
	checkoutId: string
	discountCode: string
}

export type CheckoutDiscountCodeApplyV2Response = CheckoutResponse<'checkoutDiscountCodeApplyV2'>

export const APPLY_DISCOUNT_MUTATION = /* GraphQL */ `
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
				${checkoutFields}
			}
		}
	}
`
