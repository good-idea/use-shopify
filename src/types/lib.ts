import { DocumentNode } from 'graphql'
/**
 * A function that implements uses a GraphQL library to imperitavely execute GraphQL queries and mutations.
 */
export type QueryFunction = <ExpectedResult, Variables = any>(
	query: string | DocumentNode,
	variables: Variables,
) => Promise<{ data: ExpectedResult }>
