import { Client, createRequest } from 'urql';
import { DocumentNode } from 'graphql';
import { pipe, subscribe } from 'wonka';

export const createHelpers = (client: Client) => {
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
