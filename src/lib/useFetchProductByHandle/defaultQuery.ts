import { Product } from '../types';

export const defaultQuery = /* GraphQL */ `
  query ProductQuery($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      images(first: 50) {
        edges {
          node {
            id
            altText
            originalSrc
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            availableForSale
            price
            sku
            title
            image {
              id
              altText
              originalSrc
            }
          }
        }
      }
    }
  }
`;

export interface QueryResult {
  productByHandle: Product | void;
}
