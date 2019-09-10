import { Paginated } from '@good-idea/unwind-edges'
import { Collection } from './collection'
import { ShopifyImage } from './media'
import { MoneyV2 } from './money'

interface SelectedOption {
  name: string
  value: string
}

export interface Variant {
  id: string
  availableForSale: boolean
  image?: ShopifyImage
  priceV2: MoneyV2
  product?: Product
  title: string
  selectedOptions?: SelectedOption[]
  weight?: number
  weightUnit?: string
}

interface ProductPriceRange {
  minVariantPrice: MoneyV2
  maxVariantPrice: MoneyV2
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  productType?: string
  priceRange?: ProductPriceRange
  availableForSale?: boolean
  collections?: Paginated<Collection>
  images: Paginated<ShopifyImage>
  variants: Paginated<Variant>
  __typename: 'Product'
}
