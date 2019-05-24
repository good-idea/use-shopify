import { checkoutFields } from '../graphql/fragments';

export const CHECKOUT_QUERY = /** GraphQL */ `
query CheckoutQuery($id: ID!) {
	node (id: $id) {
		id
		... on Checkout {
			${checkoutFields}
		}
	}
}

`;
