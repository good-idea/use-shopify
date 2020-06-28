import * as React from 'react'
import { unwindEdges, Paginated } from '@good-idea/unwind-edges'
import { MaybeAll, Variant as SourceVariant, Maybe } from '../types'

const { useState } = React

interface Options {
  initialVariant?: string | 'first' | 'last'
}

interface Variant extends Pick<SourceVariant, 'id'> {
  __typename: any
}

export interface UseProductVariant {
  currentVariant?: Variant
  selectVariant: (variantId: string) => void
}

interface Product<V> {
  title?: Maybe<string>
  variants?: Maybe<Paginated<Maybe<V>>>
}

interface ReturnValue<V> {
  currentVariant: V | null
  selectVariant: (id: string) => void
}

export const useProductVariant = <V extends MaybeAll<Variant>>(
  product: MaybeAll<Product<V>>,
  options: Options = {},
): ReturnValue<V> => {
  const { initialVariant } = options
  const variants = product.variants ? unwindEdges(product.variants)[0] : []
  if (!variants.length) throw new Error('The supplied product has no variants')
  /**
   * Private Methods
   */

  const findVariant = (variantId: string): V => {
    const variant = variants.find((v) => v.id === variantId)
    if (!variant)
      throw new Error(
        `There is no variant with the id "${variantId}" on the product ${product.title}`,
      )
    return variant
  }

  const getInitialState = (): V => {
    if (!initialVariant || initialVariant === 'first') return variants[0]
    if (initialVariant === 'last') return variants[variants.length - 1]
    return findVariant(initialVariant)
  }

  const [currentVariant, setCurrentVariant] = useState(getInitialState())

  /**
   * Public Methods
   */

  const selectVariant = (variantId: string) => {
    const variant = findVariant(variantId)
    setCurrentVariant(variant)
  }

  return {
    currentVariant,
    selectVariant,
  }
}
