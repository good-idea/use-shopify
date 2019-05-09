import * as React from 'react';
import { unwindEdges } from '../graphql/utils';
import { Product, Variant } from '../types';

const { useState } = React;

interface Options {
  initialVariant?: string | 'first' | 'last';
}

export interface UseProductVariant {
  currentVariant?: Variant;
  selectVariant: (variantId: string) => void;
}

export const useProductVariant = (product?: Product, options: Options = {}) => {
  const { initialVariant } = options;
  const [variants] =
    product && product.variants ? unwindEdges(product.variants) : [[]];

  /**
   * Private Methods
   */

  const findVariant = (variantId: string): Variant => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant)
      throw new Error(
        `There is no variant with the id "${variantId}" on the product ${
          product.title
        }`
      );
    return variant;
  };

  const getInitialState = (): Variant => {
    if (!initialVariant || initialVariant === 'first') return variants[0];
    if (initialVariant === 'last') return variants[variants.length - 1];
    if (typeof initialVariant !== 'string') {
      throw new Error(
        'The initialVariant option must be either `first`, `last`, or a variant ID'
      );
    }
    return findVariant(initialVariant);
  };

  const [currentVariant, setCurrentVariant] = useState(getInitialState());

  /**
   * Public Methods
   */

  const selectVariant = (variantId: string) => {
    const variant = findVariant(variantId);
    setCurrentVariant(variant);
  };

  return {
    currentVariant,
    selectVariant
  };
};
