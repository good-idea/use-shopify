import { unwindEdges } from '../graphql/utils';

const connection = {
  pageInfo: {
    hasNextPage: true,
    hasPrevPage: false
  },
  edges: [
    { cursor: 1, node: { id: 97 } },
    { cursor: 2, node: { id: 98 } },
    { cursor: 3, node: { id: 99 } }
  ]
};

describe('unwindEdges', () => {
  it('should return a tuple with the nodes and pageInfo object', () => {
    const [nodes, pageInfo] = unwindEdges(connection);
    expect(pageInfo).toEqual(connection.pageInfo);
    expect(nodes[0].id).toBe(connection.edges[0].node.id);
    expect(nodes[1].id).toBe(connection.edges[1].node.id);
    expect(nodes[2].id).toBe(connection.edges[2].node.id);
  });
});
