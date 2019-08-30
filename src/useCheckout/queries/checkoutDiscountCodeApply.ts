import { CheckoutResponse } from '../../types'
import { checkoutFields } from '../../graphql'

export interface CheckoutDiscountCodeApplyInput {
  checkoutId: string
  discountCode: string
}

export type CheckoutDiscountCodeApplyResponse = CheckoutResponse<
  'checkoutDiscountCodeApplyV2'
>

export const CHECKOUT_DISCOUNT_CODE_APPLY = /* GraphQL */ `
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
