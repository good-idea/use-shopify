import { ShopifyImage } from './media';
import { Product } from './product';
import { Paginated } from './graphql';

export interface Collection {
  id: string;
  __typename: 'Collection';
  handle: string;
  title: string;
  description?: string;
  image?: ShopifyImage;
  products?: Paginated<Product>;
}
