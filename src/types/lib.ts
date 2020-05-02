import { DocumentNode } from 'graphql'

export type Maybe<T> = T | null
/**
 * A function that implements uses a GraphQL library to imperitavely execute GraphQL queries and mutations.
 */

export type QueryFunction = <ExpectedResult, Variables extends object>(
  query: string | DocumentNode,
  variables: Variables,
) => Promise<{ data: ExpectedResult }>
