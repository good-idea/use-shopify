import { checkoutFields } from '../graphql/fragments';

export const ADD_MUTATION = /* GraphQL */ `
	mutation CheckoutAddItems($lineItems: [CheckoutLineItemInput!]!, $checkoutId: ID!) {
		checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
			userErrors {
				field
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}
`;

export const CREATE_MUTATION = /* GraphQL */ `
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
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}
`;

export const UPDATE_LINE_ITEM_MUTATION = /* GraphQL */ `
	mutation CheckoutLineItemsUpdate($lineItems: [CheckoutLineItemUpdateInput!]!, $checkoutId: ID!) {
		checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
			userErrors {
				field
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}
`;

export const APPLY_DISCOUNT_MUTATION = /* GraphQL */ `
	mutation CheckoutDiscountCodeApply($discountCode: String!, $checkoutId: ID!) {
		checkoutDiscountCodeApplyV2(discountCode: $discountCode, checkoutId: $checkoutId) {
			userErrors {
				field
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}`;

export const REMOVE_DISCOUNT_MUTATION = /* GraphQL */ `
	mutation CheckoutDiscountCodeRemove($checkoutId: ID!) {
		checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
			userErrors {
				field
				message
			}
			checkout {
				${checkoutFields}
			}
		}
	}
`;
