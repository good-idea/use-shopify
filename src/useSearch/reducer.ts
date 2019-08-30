import { unwindEdges } from '@good-idea/unwind-edges'
import { SearchState } from './useSearch'
// import { tail } from '../utils/fp'
import { SearchQueryResult } from './searchQuery'

export const NEW_SEARCH = 'NEW_SEARCH'
export const FETCH_MORE = 'FETCH_MORE'
export const FETCHED_RESULTS = 'FETCHED_RESULTS'

interface NewSearchAction {
  type: typeof NEW_SEARCH
}

interface FetchMoreAction {
  type: typeof FETCH_MORE
}

interface FetchedResultsAction {
  type: typeof FETCHED_RESULTS
  results: SearchQueryResult
}

type Action = NewSearchAction | FetchMoreAction | FetchedResultsAction

export const reducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case NEW_SEARCH:
      return {
        ...state,
        results: [],
        products: [],
        collections: [],
        loading: true,
      }
    case FETCH_MORE:
      return {
        ...state,
        loading: true,
      }
    case FETCHED_RESULTS:
      const { results } = action
      const products = results.products
        ? unwindEdges(action.results.products)[0]
        : []
      const collections = results.collections
        ? unwindEdges(action.results.collections)[0]
        : []
      return {
        ...state,
        products: [...state.products, ...products],
        collections: [...state.collections, ...collections],
        results: [...state.results, action.results],
        loading: false,
      }
    default:
      return state
  }
}
