import { CheckoutLineItemInput, AttributeInput, MailingAddressInput, CheckoutResponse } from './sharedTypes'
import { checkoutFields } from '../fragments'

export type CheckoutCreate = (input: CheckoutCreateInput) => CheckoutCreateResponse

export interface CheckoutCreateInput {
	email?: string
	lineItems?: CheckoutLineItemInput[]
	shippingAddress?: MailingAddressInput
	note?: string
	customAttributes?: AttributeInput[]
	allowPartialAddresses?: boolean
}

export type CheckoutCreateResponse = CheckoutResponse<'checkoutCreate'>

export const CREATE_CHECKOUT_MUTATION = /* GraphQL */ `
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
`
