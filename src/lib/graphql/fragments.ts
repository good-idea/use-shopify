const discountApplicationFields = /* GraphQL */ `
allocationMethod
targetSelection
targetType
...on DiscountCodeApplication {
	code
	applicable
}
value {
	...on PricingPercentageValue {
		percentage
	}
	...on MoneyV2 {
		amount
		currencyCode
	}
}
`

export const checkoutFields = /* GraphQL */ `
id
email
paymentDue
webUrl
completedAt
shippingLine {
	handle
	price
	title
}
discountApplications(first: 100) {
	pageInfo {
		hasNextPage
		hasPreviousPage
	}
	edges {
		cursor
		node {
			${discountApplicationFields}
		}
	}
}
lineItems(first: 100) {
	pageInfo {
		hasNextPage
		hasPreviousPage
	}
	edges {
		cursor
		node {
			id
			quantity
			title
			discountAllocations {
				allocatedAmount {
					amount
					currencyCode
				}
				discountApplication {
					${discountApplicationFields}
				}
			}
			variant {
				id
				title
				price
				product {
					id
					title
				}
				image {
					altText
					id
					originalSrc
				}
			}
		}
	}
}
`
