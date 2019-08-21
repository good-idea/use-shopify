import * as React from 'react'
import { unwindEdges } from '@good-idea/unwind-edges'
import { SearchQuery, SearchQueryResult, SearchQueryInput } from './searchQuery'
import { tail } from '../utils/fp'

const { useReducer } = React

interface SearchQueries {
	search: SearchQuery
}

interface SearchOptions {
	query: string
	collections?: boolean
	products?: boolean
}

export interface UseSearchValues {
	search: (options: SearchOptions) => Promise<SearchQueryResult>
	loadMore: () => Promise<SearchQueryResult>
}

/**
 * State
 */

interface SearchState {
	loading: boolean
	results?: SearchQueryResult
	currentQuery?: string
	productCursor?: string
	collectionCursor?: string
	hasNextPage: boolean
}

const NEW_SEARCH = 'NEW_SEARCH'
const FETCH_MORE = 'FETCH_MORE'
const FETCHED_RESULTS = 'FETCHED_RESULTS'

type NewSearchAction = {
	type: typeof NEW_SEARCH
	query: string
}

type FetchMoreAction = {
	type: typeof FETCH_MORE
}

type FetchedResultsAction = {
	type: typeof FETCHED_RESULTS
	results: SearchQueryResult
}

type Action = NewSearchAction | FetchMoreAction | FetchedResultsAction

const initialState: SearchState = {
	loading: false,
	results: undefined,
	hasNextPage: false,
}

const reducer = (state: SearchState, action: Action): SearchState => {
	switch (action.type) {
		case NEW_SEARCH:
			return {
				...state,
				currentQuery: action.query,
				results: undefined,
				productCursor: undefined,
				collectionCursor: undefined,
				loading: true,
			}
		case FETCH_MORE:
			return {
				...state,
				loading: true,
			}
		case FETCHED_RESULTS:
			const { results } = action
			const [products, productsPageInfo] = unwindEdges(results.products)
			const [collections, collectionsPageInfo] = unwindEdges(results.collections)
			/* If these results include new collections or products, update the cursors */
			const productCursor = products.length ? tail(products).id : state.productCursor
			const collectionCursor = collections.length ? tail(collections).id : state.collectionCursor
			/* Set hasNextPage to true if either group has more pages */
			const hasNextPage = productsPageInfo.pageInfo.hasNextPage || collectionsPageInfo.pageInfo.hasNextPage
			return {
				...state,
				productCursor,
				collectionCursor,
				hasNextPage,
				results,
			}
		default:
			return state
	}
}

/**
 * Utils
 */

const buildSearchOptions = (options: SearchOptions, state: SearchState): SearchQueryInput => {
	const { query, products, collections } = options
	const { productCursor, collectionCursor } = state

	const productQuery = products ? `${query}` : '__NO__SEARCH'
	const collectionQuery = collections ? `${query}` : '__NO_SEARCH'

	const searchOptions = {
		productQuery,
		productFirst: 36,
		productAfter: productCursor,

		collectionQuery,
		collectionFirst: 36,
		collectionAfter: collectionCursor,
	}
	return searchOptions
}

const emptyResult = {
	products: {
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
		},
		edges: [],
	},
	collections: {
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
		},
		edges: [],
	},
}

export const useSearch = ({ search: searchQuery }: SearchQueries): UseSearchValues => {
	/**
	 * Hooks Setup
	 */
	const [state, dispatch] = useReducer(reducer, initialState)

	const search = async (options: SearchOptions) => {
		dispatch({ type: NEW_SEARCH, query: options.query })
		const searchOptions = buildSearchOptions(options, state)
		const response = await searchQuery(searchOptions)
		const { data } = response
		dispatch({ type: FETCHED_RESULTS, results: data })
		return data
	}

	const loadMore = async () => {
		if (!state.hasNextPage) return emptyResult
		dispatch({ type: FETCH_MORE })
		const searchOptions = buildSearchOptions(options, state)
		const response = await searchQuery(searchOptions)
		const { data } = response
		dispatch({ type: FETCHED_RESULTS, results: data })
		return data
	}

	return {
		search,
		loadMore,
	}
}
