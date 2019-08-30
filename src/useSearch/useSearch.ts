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
    'loading' | 'products' | 'collections' | 'results' | 'hasMoreResults'
  > {
  search: (searchTerm: string) => Promise<void>
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
  results?: SearchResults[]
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

  return {
    productQuery,
    productFirst: pageSize,
    // productAfter: productCursor,
    collectionQuery,
    collectionFirst: pageSize,
    // collectionAfter: collectionCursor,
  }
}
//
// const executeQuery = <ExpectedResult>(
//   queryFn: QueryFunction,
//   queryString: string | DocumentNode,
// ) => async (
//   searchTerm: string,
//   searchState: SearchState,
// ): Promise<ExpectedResult> => {
//   const variables = getSearchVariables(searchTerm, searchState)
//
//   const response = await queryFn<ExpectedResult, SearchQueryInput>(
//     queryString,
//     variables as SearchQueryInput,
//   )
//
//   return response
// }
function debounce<T extends Function>(fn: T, delay) {
  let timer = null
  return function(...args: any) {
    const context = this
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
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
  loading: false,
  results: undefined,
  hasMoreResults: false,
  products: [],
  collections: [],
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

  /* Memoize the query function */
  const query = state.config.memoize
    ? useMemo(() => memoizeQueryFunction(userQueryFunction), [
        userQueryFunction,
      ])
    : userQueryFunction

  /* Debounce the Search function */
  const _runSearch = async (variables: SearchQueryInput) => {
    const response = await query<ExpectedResult, SearchQueryInput>(
      SEARCH_QUERY,
      variables,
    )
    const { data } = response
    dispatch({ type: FETCHED_RESULTS, results: data as ExpectedResult })
  }

  const runSearch =
    state.config.debounce && state.config.debounce > 0
      ? useMemo(() => debounce(_runSearch, config.debounce), [config.debounce])
      : _runSearch

  const { SEARCH_QUERY } = {
    ...defaultQueries,
    ...queries,
  }

  /**
   * Updates the settings for a new search,
   * and resets product & collection cursors
   */
  const search = async (searchTerm: string) => {
    dispatch({ type: NEW_SEARCH })
    const variables = getSearchVariables(searchTerm, state)
    runSearch(variables)
  }

  // const loadMore = async () => {
  // 	if (!state.hasNextPage) return emptyResult
  // 	dispatch({ type: FETCH_MORE })
  // 	const variables = getSearchVariables(state.currentOptions, state)
  // 	const response = await query<SearchQueryResult, SearchQueryInputSearchInput>(SEARCH_QUERY, variables)
  // 	const { data } = response
  // 	dispatch({ type: FETCHED_RESULTS, results: data })
  // 	return data
  // }

  const { loading, products, collections, results, hasMoreResults } = state
  return {
    /* State */
    loading,
    results,
    hasMoreResults,
    products,
    collections,
    /* Methods */
    search,
    // loadMore,
  }
}
