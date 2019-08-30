// import { unwindEdges } from '@good-idea/unwind-edges'
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
        loading: true,
      }
    case FETCH_MORE:
      return {
        ...state,
        loading: true,
      }
    case FETCHED_RESULTS:
      return {
        ...state,
        results: action.results,
        loading: false,
      }
    default:
      return state
  }
}
