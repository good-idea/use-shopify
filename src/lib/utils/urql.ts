import { Client, createRequest } from 'urql';
import { DocumentNode } from 'graphql';
import { pipe, subscribe } from 'wonka';
import {
  FETCH_CHECKOUT_QUERY,
  CREATE_CHECKOUT_MUTATION,
  ADD_ITEM_MUTATION,
  APPLY_DISCOUNT_MUTATION,
  UPDATE_ITEM_MUTATION,
  REMOVE_DISCOUNT_MUTATION
} from '../graphql/queries';

const createHelpers = (client: Client) => {
  const createQuery = (
    query: string | DocumentNode,
    initialVariables: object = {}
  ) => {
    const queryFn = (newVariables?: object): Promise<any> =>
      new Promise(resolve => {
        const variables = newVariables || initialVariables;
        const request = createRequest(query, variables);
        pipe(
          client.executeQuery(request),
          subscribe(resolve)
        );
      });

    return queryFn;
  };

  return {
    createQuery
  };
};

export const createUrqlQueries = (client: Client) => {
  const { createQuery } = createHelpers(client);
  return {
    fetchCheckout: createQuery(FETCH_CHECKOUT_QUERY),
    checkoutCreate: createQuery(CREATE_CHECKOUT_MUTATION),
    checkoutLineItemsAdd: createQuery(ADD_ITEM_MUTATION),
    checkoutLineItemsUpdate: createQuery(UPDATE_ITEM_MUTATION),
    checkoutDiscountCodeApply: createQuery(APPLY_DISCOUNT_MUTATION),
    checkoutDiscountCodeRemove: createQuery(REMOVE_DISCOUNT_MUTATION)
  };
};
