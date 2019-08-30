import * as React from 'react'
import { memoize } from 'lodash'
import { Paginated } from '@good-idea/unwind-edges'
import { DocumentNode } from 'graphql'
import { Product, Collection, QueryFunction } from '../types'
import {
  defaultQueries,
  SearchQueryResult,
  SearchQueryInput,
} from './searchQuery'
import { NEW_SEARCH, FETCHED_RESULTS, reducer } from './reducer'

const { useEffect, useReducer, useMemo } = React

/**
 * API
 */

export interface UseSearchQueries {
  SEARCH_QUERY: string | DocumentNode
}

export interface UseSearchConfig {
  collections: boolean
  products: boolean
  memoize: boolean
  pageSize: number
}

interface UseSearchArguments {
  query: QueryFunction
  config?: Partial<UseSearchConfig>
  queries?: Partial<UseSearchQueries>
}

export interface UseSearchValues
  extends Pick<SearchState, 'loading' | 'results' | 'hasMoreResults'> {
  search: (searchTerm: string) => Promise<void>
  foo: string
  // loadMore: () => Promise<SearchQueryResult>
}

/**
 * State
 */

interface SearchResults {
  products?: Paginated<Product>
  collections?: Paginated<Collection>
}

export interface SearchState {
  loading: boolean
  products: Product[]
  collections: Collection[]
  results?: SearchResults
  config?: UseSearchConfig
  hasMoreResults: boolean
}

/**
 * Utils
 */

const getSearchVariables = (
  searchTerm: string,
  searchState: SearchState,
): SearchQueryInput => {
  const { pageSize, products, collections } = searchState.config

  const productQuery = products ? `${searchTerm}` : '__NO__SEARCH'
  const collectionQuery = collections ? `${searchTerm}` : '__NO_SEARCH'

  const searchOptions = {
    productQuery,
    productFirst: pageSize,
    // productAfter: productCursor,

    collectionQuery,
    collectionFirst: pageSize,
    // collectionAfter: collectionCursor,
  }
  return searchOptions
}
const defaultConfig = {
  collections: true,
  products: true,
  memoize: true,
  pageSize: 96,
}

const getInitialState = (
  userConfig: Partial<UseSearchConfig>,
): SearchState => ({
  loading: false,
  results: undefined,
  hasMoreResults: false,
  products: [],
  collections: [],
  config: {
    ...defaultConfig,
    ...userConfig,
  },
})

/**
 * useSearch
 */

export const useSearch = <ExpectedResult extends SearchQueryResult>({
  query: userQuery,
  config: userConfig,
  queries,
}: UseSearchArguments): UseSearchValues => {
  const [state, dispatch] = useReducer(reducer, getInitialState(userConfig))

  /* Memoize the query function */
  const query = state.config.memoize
    ? useMemo(() => memoize(userQuery, (...args) => JSON.stringify(args)), [
        userQuery,
      ])
    : userQuery

  const { SEARCH_QUERY } = {
    ...defaultQueries,
    ...queries,
  }

  const runSearch = async (variables: SearchQueryInput) => {
    const response = await query<ExpectedResult, SearchQueryInput>(
      SEARCH_QUERY,
      variables,
    )
    const { data } = response
    dispatch({ type: FETCHED_RESULTS, results: data as ExpectedResult })
  }

  /**
   * Updates the settings for a new search,
   * and resets product & collection cursors
   */
  const search = async (searchTerm: string) => {
    dispatch({ type: NEW_SEARCH })
    const variables = getSearchVariables(searchTerm, state)
    runSearch(variables)
    // const variables = getSearchVariables(searchTerm, options, state)
    // const response = await query<SearchQueryResult, SearchQueryInput>(SEARCH_QUERY, variables)
    // const { data } = response
    // return data
  }
  //
  // const loadMore = async () => {
  // 	if (!state.hasNextPage) return emptyResult
  // 	dispatch({ type: FETCH_MORE })
  // 	const variables = getSearchVariables(state.currentOptions, state)
  // 	const response = await query<SearchQueryResult, SearchQueryInputSearchInput>(SEARCH_QUERY, variables)
  // 	const { data } = response
  // 	dispatch({ type: FETCHED_RESULTS, results: data })
  // 	return data
  // }
  //

  const { loading, results, hasMoreResults } = state
  return {
    // State
    loading,
    results,
    hasMoreResults,
    foo: 'bar',
    // Methods
    search,
    // loadMore,
  }
}
