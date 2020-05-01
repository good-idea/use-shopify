import { DocumentNode } from 'graphql'
import { Checkout, UserError } from './generated'

/**
 * A function that implements uses a GraphQL library to imperitavely execute GraphQL queries and mutations.
 */
export type QueryFunction = <ExpectedResult, Variables = any>(
  query: string | DocumentNode,
  variables: Variables,
) => Promise<{ data: ExpectedResult }>

export type CheckoutResponse<Key extends string> = {
  [K in Key]: {
    checkout?: Checkout
    checkoutUserErrors?: UserError[]
  }
}
