import { act, renderHook } from '@testing-library/react-hooks'
import { useProductVariant } from '../useProductVariant'
import { dummyProduct } from './stubs'

describe('useProductVariant', () => {
  it('should provide the first variant by default', () => {
    const { result } = renderHook(() => useProductVariant(dummyProduct))
    expect(result.current.currentVariant).toMatchObject(
      dummyProduct.variants.edges[0].node,
    )
  })

  it('should provide the first variant by default', () => {
    const { result } = renderHook(() =>
      useProductVariant(dummyProduct, { initialVariant: 'last' }),
    )
    expect(result.current.currentVariant).toMatchObject(
      dummyProduct.variants.edges[2].node,
    )
  })

  it('should find the initialVariant by id', () => {
    const variant2 = dummyProduct.variants.edges[1].node
    const { result } = renderHook(() =>
      useProductVariant(dummyProduct, { initialVariant: variant2.id }),
    )
    expect(result.current.currentVariant).toMatchObject(variant2)
  })

  it('should throw if the initialVariant does not exist', () => {
    const { result } = renderHook(() =>
      useProductVariant(dummyProduct, { initialVariant: '2' }),
    )
    expect(result.error.message).toBe(
      'There is no variant with the id "2" on the product Dummy Product',
    )
  })

  it('should change the selected variant', () => {
    const variant1 = dummyProduct.variants.edges[0].node
    const variant2 = dummyProduct.variants.edges[1].node
    const { result } = renderHook(() => useProductVariant(dummyProduct))
    expect(result.current.currentVariant).toMatchObject(variant1)

    act(() => {
      result.current.selectVariant(variant2.id)
    })
    expect(result.current.currentVariant).toMatchObject(variant2)
  })

  it('should throw if the product has no variants', () => {
    const dummyProductNoVariants = {
      ...dummyProduct,
      variants: {
        pageInfo: { hasNextPage: false, hasPrevPage: false },
        edges: [],
      },
    }
    const { result } = renderHook(() =>
      useProductVariant(dummyProductNoVariants),
    )
    expect(result.error.message).toBe('The supplied product has no variants')
  })
})
