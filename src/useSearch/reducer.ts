import { unwindEdges } from '@good-idea/unwind-edges'
import { SearchState } from './useSearch'
// import { tail } from '../utils/fp'
import { SearchQueryResult } from './searchQuery'

export const NEW_SEARCH = 'NEW_SEARCH'
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM'
export const FETCH_MORE = 'FETCH_MORE'
export const FETCHED_RESULTS = 'FETCHED_RESULTS'
export const RESET = 'RESET'

interface NewSearchAction {
  type: typeof NEW_SEARCH
  searchTerm?: string
}

interface FetchMoreAction {
  type: typeof FETCH_MORE
}

interface FetchedResultsAction {
  type: typeof FETCHED_RESULTS
  results: SearchQueryResult
}

interface SetSearchTermAction {
  type: typeof SET_SEARCH_TERM
  searchTerm: string
}

interface ResetAction {
  type: typeof RESET
}

type Action =
  | NewSearchAction
  | FetchMoreAction
  | FetchedResultsAction
  | SetSearchTermAction
  | ResetAction

export const initialState = {
  searchTerm: '',
  loading: false,
  results: [],
  products: [],
  collections: [],
  hasMoreResults: false,
  stale: false,
  lastSearchTerm: undefined,
}

export const reducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case NEW_SEARCH:
      return {
        ...state,
        searchTerm: action.searchTerm ? action.searchTerm : state.searchTerm,
        results: [],
        products: [],
        collections: [],
        lastSearchTerm: action.searchTerm
          ? action.searchTerm
          : state.searchTerm,
        loading: true,
      }
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
        stale: action.searchTerm === state.lastSearchTerm,
      }
    case FETCH_MORE:
      return {
        ...state,
        loading: true,
      }
    case FETCHED_RESULTS:
      const { results } = action
      const products = results.products ? unwindEdges(results.products)[0] : []
      const collections = results.collections
        ? unwindEdges(results.collections)[0]
        : []
      return {
        ...state,
        products: [...state.products, ...products],
        collections: [...state.collections, ...collections],
        results: [...state.results, results],
        loading: false,
      }

    case RESET:
      // reset everything but the initial config
      return {
        ...initialState,
        config: state.config,
      }
    default:
      // @ts-ignore
      console.warn(`"${action.type}" is not handled in the reducer`)
      return state
  }
}
