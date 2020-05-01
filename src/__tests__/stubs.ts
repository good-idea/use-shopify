import { Product, Image, MoneyV2, CurrencyCode } from '../types'

const dummyImage: Image = {
  id: 'xyz',
  src: '/dummy-1.png',
  originalSrc: '/dummy-1.png',
  transformedSrc: '/dummy-1.png',
  __typename: 'Image' as 'Image',
}

const dummyPrice: MoneyV2 = {
  __typename: 'MoneyV2' as 'MoneyV2',
  amount: 100.0,
  currencyCode: CurrencyCode.Usd,
}

export const dummyProduct: Product = {
  id: '123',
  handle: 'dummy-product',
  title: 'Dummy Product',
  description: 'Just a dumb thing you can buy!',
  __typename: 'Product',
  images: {
    __typename: 'ImageConnection',
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [
      { __typename: 'ImageEdge', cursor: '1', node: dummyImage },
      { __typename: 'ImageEdge', cursor: '2', node: dummyImage },
    ],
  },
  variants: {
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [
      {
        cursor: '234',
        node: {
          id: 'abc',
          availableForSale: true,
          image: dummyImage,
          priceV2: dummyPrice,
          title: 'First',
        },
      },
      {
        cursor: '345',
        node: {
          id: 'bcd',
          availableForSale: true,
          image: {
            id: 'xyz',
            originalSrc: '/dummy-2.png',
            __typename: 'Image',
          },
          priceV2: dummyPrice,
          title: 'Second',
        },
      },
      {
        cursor: '456',
        node: {
          id: 'cde',
          availableForSale: true,
          image: {
            id: 'xyz',
            originalSrc: '/dummy-2.png',
            __typename: 'Image',
          },
          priceV2: dummyPrice,
          title: 'Third',
        },
      },
    ],
  },
} as Product
