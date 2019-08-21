import { Paginated } from '@good-idea/unwind-edges'
import { Product, Collection } from '../types'
import { productFragment, collectionFragment } from '../graphql/fragments'

export type SearchQuery = (
	input: SearchQueryInput,
) => Promise<{
	data: SearchQueryResult
}>

export interface SearchQueryResult {
	products: Paginated<Product>
	collections: Paginated<Collection>
}

export interface SearchQueryInput {
	productQuery: string
	productFirst: number
	productAfter?: string
	productLast?: number
	productBefore?: string
	productReverse?: boolean

	collectionQuery: string
	collectionFirst: number
	collectionAfter?: string
	collectionLast?: number
	collectionBefore?: string
	collectionReverse?: boolean
}

export const SEARCH_QUERY = /* GraphQL */ `
query SearchQuery(
  $productFirst: Int!,
  $productAfter: String,
  $productLast: Int,
  $productBefore: Int,
  $productReverse: Boolean,
  $productSortKey: ProductSortKeys,
  $productQuery: String!
  $collectionFirst: Int!,
  $collectionAfter: String,
  $collectionLast: Int,
  $collectionBefore: Int,
  $collectionReverse: Boolean,
  $collectionSortKey: ProductSortKeys,
  $collectionQuery: String!
) {
  products (
    first: $productFirst,
    after: $productAfter,
    last: $productLast,
    before: $productBefore,
    reverse: $productReverse,
    sortKey: $productSortKey,
    query: $productQuery
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ...ProductFragment
      }
    }
  }

  collections (
    first: $collectionFirst,
    after: $collectionAfter,
    last: $collectionLast,
    before: $collectionBefore,
    reverse: $collectionReverse,
    sortKey: $collectionSortKey,
    query: $collectionQuery
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ...CollectionFragment
      }
    }
  }
  ${productFragment}
  ${collectionFragment}
}
`
