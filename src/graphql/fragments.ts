import gql from 'graphql-tag'

export const moneyV2Fragment = gql`
  fragment MoneyV2Fragment on MoneyV2 {
    __typename
    amount
    currencyCode
  }
`
export const imageFragment = gql`
  fragment ImageFragment on Image {
    __typename
    altText
    id
    originalSrc
  }
`

export const collectionFragment = gql`
  fragment CollectionFragment on Collection {
    __typename
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
    __typename
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
      __typename
      edges {
        __typename
        node {
          ...ImageFragment
        }
      }
    }
    options(first: 100) {
      __typename
      id
      name
      values
    }
    priceRange {
      __typename
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
    __typename
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
      __typename
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
    __typename
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
      __typename
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
    __typename
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
      __typename
      edges {
        __typename
        node {
          ...ImageFragment
        }
      }
    }
    options(first: 100) {
      __typename
      id
      name
      values
    }
    priceRange {
      __typename
      maxVariantPrice {
        ...MoneyV2Fragment
      }
      minVariantPrice {
        ...MoneyV2Fragment
      }
    }
    variants(first: 100) {
      __typename
      pageInfo {
        __typename
        hasNextPage
        hasPreviousPage
      }
      edges {
        __typename
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
    __typename
    allocationMethod
    targetSelection
    targetType
    ... on DiscountCodeApplication {
      __typename
      code
      applicable
    }
    value {
      ... on PricingPercentageValue {
        __typename
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
    __typename
    id
    quantity
    title
    discountAllocations {
      __typename
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
    __typename
    id
    paymentDueV2 {
      ...MoneyV2Fragment
    }
    webUrl
    completedAt
    shippingLine {
      __typename
      handle
      price
      title
    }
    email
    discountApplications(first: 100) {
      __typename
      pageInfo {
        __typename
        hasNextPage
        hasPreviousPage
      }
      edges {
        __typename
        cursor
        node {
          ...DiscountApplicationFragment
        }
      }
    }
    lineItems(first: 100) {
      __typename
      pageInfo {
        __typename
        hasNextPage
        hasPreviousPage
      }
      edges {
        __typename
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
