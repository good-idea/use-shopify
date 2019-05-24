import { CheckoutResponse } from './sharedTypes';
import { checkoutFields } from '../fragments';

export type CheckoutDiscountCodeRemove = (
  input: CheckoutDiscountCodeRemoveInput
) => CheckoutDiscountCodeRemoveResponse;

export interface CheckoutDiscountCodeRemoveInput {
  checkoutId: string;
}

export type CheckoutDiscountCodeRemoveResponse = CheckoutResponse<
  'checkoutDiscountCodeRemove'
>;

export const REMOVE_DISCOUNT_MUTATION = /* GraphQL */ `
	mutation CheckoutDiscountCodeRemove(
		$checkoutId: String
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
`;
