import { Paginated } from '@good-idea/unwind-edges'
import gql from 'graphql-tag'
import { Product, Collection } from '../types'
import { productFragment, collectionFragment } from '../graphql'

export type SearchQuery = (
  input: SearchQueryInput,
) => Promise<{
  data: SearchQueryResult
}>

export interface SearchQueryResult {
  products: Paginated<Product> | null
  collections: Paginated<Collection> | null
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

// TODO: Break this into two queries

export const SEARCH_QUERY = gql`
  query SearchQuery(
    $productFirst: Int!
    $productAfter: String
    $productLast: Int
    $productBefore: String
    $productReverse: Boolean
    $productSortKey: ProductSortKeys
    $productQuery: String!
    $collectionFirst: Int!
    $collectionAfter: String
    $collectionLast: Int
    $collectionBefore: String
    $collectionReverse: Boolean
    $collectionSortKey: CollectionSortKeys
    $collectionQuery: String!
  ) {
    products(
      first: $productFirst
      after: $productAfter
      last: $productLast
      before: $productBefore
      reverse: $productReverse
      sortKey: $productSortKey
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

    collections(
      first: $collectionFirst
      after: $collectionAfter
      last: $collectionLast
      before: $collectionBefore
      reverse: $collectionReverse
      sortKey: $collectionSortKey
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
  }
  ${productFragment}
  ${collectionFragment}
`

export const defaultQueries = { SEARCH_QUERY }
