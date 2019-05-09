import { useQuery, CombinedError, OperationContext, RequestPolicy } from 'urql';
import { defaultQuery, QueryResult } from './defaultQuery';

interface FetchConfig {
  skip?: boolean;
  query?: string;
  requestPolicy?: RequestPolicy;
}

interface UseQueryState<T> {
  fetching: boolean;
  data?: T;
  error?: CombinedError;
}

type Response<T> = [
  UseQueryState<T>,
  (opts?: Partial<OperationContext> | undefined) => void
];

export function useFetchProductByHandle<ExpectedResult = QueryResult>(
  handle: string,
  config: FetchConfig = {}
): Response<ExpectedResult> {
  const { query, requestPolicy } = config;
  const variables = {
    handle
  };
  return useQuery({
    query: query || defaultQuery,
    variables,
    requestPolicy
  });
}
