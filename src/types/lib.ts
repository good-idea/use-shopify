import { DocumentNode } from 'graphql'

export type Maybe<T> = T | null

export type MaybeAll<T> = {
  [K in keyof T]?: null | Maybe<T[K]>
}

/**
 * A function that implements uses a GraphQL library to imperitavely execute GraphQL queries and mutations.
 */

export type QueryFunction = <ExpectedResult, Variables extends object>(
  query: string | DocumentNode,
  variables: Variables,
) => Promise<{ data: ExpectedResult }>
