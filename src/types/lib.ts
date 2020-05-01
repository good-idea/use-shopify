import { DocumentNode } from 'graphql'
import { Checkout, UserError } from './generated'

/**
 * A function that implements uses a GraphQL library to imperitavely execute GraphQL queries and mutations.
 */

interface VariablesObject {
  [key: string]: string | number | boolean | void | null | VariablesObject
}

export type QueryFunction = <ExpectedResult, Variables extends VariablesObject>(
  query: string | DocumentNode,
  variables: Variables,
) => Promise<{ data: ExpectedResult }>

export type CheckoutResponse<Key extends string> = {
  [K in Key]: {
    checkout?: Checkout
    checkoutUserErrors?: UserError[]
  }
}
