import { Paginated } from '@good-idea/unwind-edges'
import { ShopifyImage } from './media'
import { Product } from './product'

export interface Collection {
  id: string
  __typename: 'Collection'
  handle: string
  title: string
  description?: string
  image?: ShopifyImage
  products?: Paginated<Product>
}
