import { PageInfo, Paginated } from '../types';

type UnwoundEdges<EdgeType> = [EdgeType[], PageInfo];

export const unwindEdges = <EdgeType>({
  edges,
  pageInfo
}: Paginated<EdgeType>): UnwoundEdges<EdgeType> => [
  edges.map(edge => edge.node),
  pageInfo
];
