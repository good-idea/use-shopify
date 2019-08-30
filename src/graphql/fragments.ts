export const moneyV2Fragment = /* GraphQL */ `
  fragment MoneyV2Fragment on MoneyV2 {
    amount
    currencyCode
  }
`
export const imageFragment = /* GraphQL */ `
  fragment ImageFragment on Image {
    altText
    id
    originalSrc
  }
`

export const collectionFragment = /* GraphQL */ `
  fragment CollectionFragment on Collection {
    description
    descriptionHtml
    handle
    id
    image {
      ...ImageFragment
    }
    title
    updatedAt
  }
  ${imageFragment}
`

export const productFragment = /* GraphQL */ `
  fragment ProductFragment on Product {
    availableForSale
    createdAt
    description
    descriptionHtml
    handle
    id
    productType
    publishedAt
    tags
    title
    vendor
    images(first: 100) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    options(first: 100) {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        ...MoneyV2Fragment
      }
      minVariantPrice {
        ...MoneyV2Fragment
      }
    }
    variants(first: 100) {
      availableForSale
      id
      sku
      title
      weight
      weightUnit
      compareAtPriceV2 {
        ...MoneyV2Fragment
      }
      priceV2 {
        ...MoneyV2Fragment
      }
      requiresShipping
      selectedOptions {
        name
        value
      }
    }
  }

  ${imageFragment}
  ${moneyV2Fragment}
`

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
    ...MoneyV2Fragment
	}
}
${moneyV2Fragment}
`

export const checkoutFields = /* GraphQL */ `
id
email
paymentDueV2 {
  ...MoneyV2Fragment
}
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
          ...MoneyV2Fragment
				}
				discountApplication {
					${discountApplicationFields}
				}
			}
			variant {
				id
				title
        priceV2 {
          ...MoneyV2Fragment
        }
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
${moneyV2Fragment}
`
