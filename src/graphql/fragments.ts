import gql from 'graphql-tag'

export const moneyV2Fragment = gql`
  fragment MoneyV2Fragment on MoneyV2 {
    amount
    currencyCode
  }
`
export const imageFragment = gql`
  fragment ImageFragment on Image {
    altText
    id
    originalSrc
  }
`

export const collectionFragment = gql`
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

export const productWithoutVariantsFragment = gql`
  fragment ProductWithoutVariantsFragment on Product {
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
  }

  ${imageFragment}
  ${moneyV2Fragment}
`

export const variantWithProductFragment = gql`
  fragment VariantWithProductFragment on ProductVariant {
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
    product {
      ...ProductWithoutVariantsFragment
    }
    image {
      ...ImageFragment
    }
    requiresShipping
    selectedOptions {
      name
      value
    }
  }
  ${moneyV2Fragment}
  ${productWithoutVariantsFragment}
  ${imageFragment}
`

export const variantFragment = gql`
  fragment VariantFragment on ProductVariant {
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
    image {
      ...ImageFragment
    }
  }
  ${moneyV2Fragment}
  ${imageFragment}
`

export const productFragment = gql`
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
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...VariantFragment
        }
      }
    }
  }

  ${imageFragment}
  ${moneyV2Fragment}
  ${variantFragment}
`

export const discountApplicationFragment = gql`
  fragment DiscountApplicationFragment on DiscountApplication {
    allocationMethod
    targetSelection
    targetType
    ... on DiscountCodeApplication {
      code
      applicable
    }
    value {
      ... on PricingPercentageValue {
        percentage
      }
      ... on MoneyV2 {
        ...MoneyV2Fragment
      }
    }
  }
  ${moneyV2Fragment}
`

export const lineItemFragment = gql`
  fragment LineItemFragment on CheckoutLineItem {
    id
    quantity
    title
    discountAllocations {
      allocatedAmount {
        ...MoneyV2Fragment
      }
      discountApplication {
        ...DiscountApplicationFragment
      }
    }
    variant {
      ...VariantWithProductFragment
    }
  }
  ${discountApplicationFragment}
  ${variantWithProductFragment}
`

export const checkoutFragment = gql`
  fragment CheckoutFragment on Checkout {
    id
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
    email
    discountApplications(first: 100) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...DiscountApplicationFragment
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
          ...LineItemFragment
        }
      }
    }
  }

  ${moneyV2Fragment}
  ${discountApplicationFragment}
  ${lineItemFragment}
`
