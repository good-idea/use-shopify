import * as React from 'react'
import { memoize } from 'lodash'
import { Paginated } from '@good-idea/unwind-edges'
import { DocumentNode } from 'graphql'
import { debounce } from '../utils'
import { Product, Collection, QueryFunction } from '../types'
import {
  defaultQueries,
  SearchQueryResult,
  SearchQueryInput,
} from './searchQuery'
import {
  SET_SEARCH_TERM,
  RESET,
  NEW_SEARCH,
  FETCHED_RESULTS,
  reducer,
} from './reducer'

const { useEffect, useReducer, useMemo } = React

/**
 * API
 */

export interface UseSearchQueries {
  SEARCH_QUERY: string | DocumentNode
}

export interface UseSearchConfig {
  /* Wether or not the search should include collections */
  collections: boolean
  /* Wether or not the search should include products */
  products: boolean
  /* The page size for search queries. Defaults to 96 */
  pageSize: number
  /* Wether or not the search function should be memoized. Defaults to true */
  memoize: boolean
  /* How long the search function should be debounced for. Defaults to 200, set to 0 to disable */
  debounce: number
}

interface UseSearchArguments {
  query: QueryFunction
  config?: Partial<UseSearchConfig>
  queries?: Partial<UseSearchQueries>
}

export interface UseSearchValues
  extends Pick<
    SearchState,
    | 'searchTerm'
    | 'loading'
    | 'products'
    | 'collections'
    | 'results'
    | 'hasMoreResults'
  > {
  search: (searchTerm?: string) => Promise<void>
  setSearchTerm: (searchTerm?: string) => void
  // loadMore: () => Promise<SearchQueryResult>
}

/**
 * State
 */

export interface SearchState {
  loading: boolean
  products: Product[]
  collections: Collection[]
  results: SearchQueryResult[]
  config: UseSearchConfig
  searchTerm: string
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

  return {
    productQuery,
    productFirst: pageSize,
    // productAfter: productCursor,
    collectionQuery,
    collectionFirst: pageSize,
    // collectionAfter: collectionCursor,
  }
}

const memoizeQueryFunction = (fn: QueryFunction) =>
  memoize(fn, (...args) => JSON.stringify(args))

const defaultConfig: UseSearchConfig = {
  collections: true,
  products: true,
  memoize: true,
  debounce: 200,
  pageSize: 96,
}

const getInitialState = (config: UseSearchConfig): SearchState => ({
  searchTerm: '',
  loading: false,
  results: [],
  products: [],
  collections: [],
  hasMoreResults: false,
  config,
})

/**
 * useSearch
 */

export const useSearch = <ExpectedResult extends SearchQueryResult>({
  query: userQueryFunction,
  config: userConfig,
  queries,
}: UseSearchArguments): UseSearchValues => {
  const config = {
    ...defaultConfig,
    ...userConfig,
  }
  const [state, dispatch] = useReducer(reducer, getInitialState(config))

  /* Memoize the query function, and
   * debounce the Search function
   * Use React's useMemo so we only create these once */
  const query = state.config.memoize
    ? (useMemo(() => memoizeQueryFunction(userQueryFunction), [
        userQueryFunction,
      ]) as QueryFunction)
    : userQueryFunction

  const runSearchFn = async (variables: SearchQueryInput) => {
    const response = await query<ExpectedResult, SearchQueryInput>(
      SEARCH_QUERY,
      variables,
    )
    const { data } = response
    dispatch({ type: FETCHED_RESULTS, results: data })
  }

  const runSearch =
    state.config.debounce && state.config.debounce > 0
      ? useMemo(
          () => debounce<typeof runSearchFn>(runSearchFn, config.debounce),
          [config.debounce],
        )
      : runSearchFn

  const { SEARCH_QUERY } = {
    ...defaultQueries,
    ...queries,
  }

  /**
   * Updates the settings for a new search,
   * and resets product & collection cursors
   */
  const search = async (searchTerm?: string) => {
    dispatch({ type: NEW_SEARCH, searchTerm })
    const variables = getSearchVariables(searchTerm || state.searchTerm, state)
    runSearch(variables)
  }

  const setSearchTerm = (searchTerm: string = '') =>
    dispatch({ type: SET_SEARCH_TERM, searchTerm })

  // const loadMore = async () => {
  // 	if (!state.hasNextPage) return emptyResult
  // 	dispatch({ type: FETCH_MORE })
  // 	const variables = getSearchVariables(state.currentOptions, state)
  // 	const response = await query<SearchQueryResult, SearchQueryInputSearchInput>(SEARCH_QUERY, variables)
  // 	const { data } = response
  // 	dispatch({ type: FETCHED_RESULTS, results: data })
  // 	return data
  // }

  const {
    searchTerm,
    loading,
    products,
    collections,
    results,
    hasMoreResults,
  } = state
  return {
    /* State */
    searchTerm,
    loading,
    results,
    hasMoreResults,
    products,
    collections,
    /* Methods */
    search,
    setSearchTerm,
    // reset
    // loadMore,
  }
}
