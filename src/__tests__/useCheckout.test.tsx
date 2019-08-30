import { renderHook } from '@testing-library/react-hooks'
import { wait, act } from '@testing-library/react'
import { useCheckout } from '../useCheckout'
// import { dummyProduct } from './stubs'
import * as defaultUseCheckoutQueries from '../useCheckout/queries'

jest.useFakeTimers()

const dummyLineItemAdd = { id: 'checkoutIdxyz', quantity: 1 }

const defaultDummyCheckoutResponse = {
	checkout: {
		id: 'foo',
	},
	checkoutUserErrors: [],
}

const dummyResponse = (key: string, response: any = {}) => ({
	data: {
		[key]: {
			...defaultDummyCheckoutResponse,
			...response,
		},
	},
})

const queries = defaultUseCheckoutQueries

beforeAll(() => {
	console.error = jest.fn()
})

afterAll(() => {
	// @ts-ignore
	console.error.mockRestore()
})
/**
 * Most of these tests are simply making sure that the reducer is applying
 * an updated `checkout` after running the query.
 */

describe('useCheckout', () => {
	it('[checkoutLineItemsAdd] should create a new checkout if none exists', async () => {
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsAdd', { checkout: { id: 'added' } }))
		const { result } = renderHook(() => useCheckout({ query, queries }))
		const { checkout, checkoutLineItemsAdd } = result.current

		await wait()
		expect(checkout).toBe(undefined)
		act(() => {
			checkoutLineItemsAdd([dummyLineItemAdd])
		})

		await wait()
		expect(result.current.checkout).toBeTruthy()
		if (!result.current.checkout) throw new Error('checkout was not created')
		expect(query).toHaveBeenCalledTimes(2)
		expect(result.current.checkout.id).toBe('added')
	})

	it('[checkoutLineItemsUpdate] should apply a new checkout to the state', async () => {
		const updatedLineItem = {
			...dummyLineItemAdd,
			quantity: 2,
		}
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsAdd', { checkout: { lineItems: [dummyLineItemAdd] } }))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsUpdate', { checkout: { lineItems: [updatedLineItem] } }))
		const { result } = renderHook(() => useCheckout({ query, queries }))

		act(() => {
			result.current.checkoutLineItemsAdd([dummyLineItemAdd])
		})
		await wait()
		act(() => {
			result.current.checkoutLineItemsUpdate([dummyLineItemAdd])
		})

		await wait()
		if (!result.current.checkout) throw new Error('checkout was not created')

		expect(query).toHaveBeenCalledTimes(3)
		expect(result.current.checkout.lineItems[0].quantity).toBe(2)
	})

	it('[checkoutDiscountCodeApply] should apply a new checkout to the state', async () => {
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsAdd'))
			.mockResolvedValueOnce(dummyResponse('checkoutDiscountCodeApplyV2', { checkout: { id: 'applied' } }))
		const { result } = renderHook(() => useCheckout({ query, queries }))

		act(() => {
			result.current.checkoutLineItemsAdd([dummyLineItemAdd])
		})
		await wait()
		act(() => {
			result.current.checkoutDiscountCodeApply('myCode')
		})

		await wait()
		if (!result.current.checkout) throw new Error('checkout was not created')
		expect(query).toHaveBeenCalledTimes(3)
		expect(result.current.checkout.id).toBe('applied')
	})

	it('[checkoutDiscountCodeRemove] should apply a new checkout to the state', async () => {
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsAdd'))
			.mockResolvedValueOnce(dummyResponse('checkoutDiscountCodeRemove', { checkout: { id: 'removed' } }))
		const { result } = renderHook(() => useCheckout({ query, queries }))

		act(() => {
			result.current.checkoutLineItemsAdd([dummyLineItemAdd])
		})
		await wait()
		act(() => {
			result.current.checkoutDiscountCodeRemove()
		})

		await wait()

		if (!result.current.checkout) throw new Error('checkout was not created')
		expect(query).toHaveBeenCalledTimes(3)
		expect(result.current.checkout.id).toBe('removed')
	})

	it('[clearCart] should empty the cart', async () => {
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(dummyResponse('checkoutLineItemsAdd'))
		const { result } = renderHook(() => useCheckout({ query, queries }))
		const { current } = result

		await wait()
		expect(current.checkout).toBe(undefined)
		act(() => {
			current.checkoutLineItemsAdd([dummyLineItemAdd])
		})

		await wait()
		expect(result.current.checkout).toBeTruthy()
		if (!result.current.checkout) throw new Error('checkout was not created')
		expect(query).toHaveBeenCalledTimes(2)
		expect(result.current.checkout.id).toBe('foo')

		act(() => {
			current.clearCheckout()
		})
		expect(result.current.checkout).toBe(undefined)
		expect(result.current.checkoutUserErrors).toBe(undefined)
	})

	it('should return userErrors if the request returned errors', async () => {
		const query = jest
			.fn()
			.mockResolvedValueOnce(dummyResponse('checkoutCreate'))
			.mockResolvedValueOnce(
				dummyResponse('checkoutLineItemsAdd', { checkoutUserErrors: [{ field: 'email', message: 'That is not a valid email' }] }),
			)
		const { result } = renderHook(() => useCheckout({ query, queries }))
		const { current } = result

		await wait()
		expect(current.checkout).toBe(undefined)
		act(() => {
			current.checkoutLineItemsAdd([dummyLineItemAdd])
		})
		await wait()
		expect(result.current.checkoutUserErrors[0].message).toBe('That is not a valid email')
	})
	// it('[addToCheckout] should add new items to the current checkout', async () => {
	// 	const queries = createMockQueries()
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	await wait()
	//
	// 	act(() => {
	// 		result.current.addToCheckout({ lineItems: [dummyLineItemAdd] })
	// 	})
	// 	await wait()
	// 	expect(queries.checkoutCreate).toHaveBeenCalledTimes(0)
	// 	expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(1)
	// 	act(() => {
	// 		result.current.addToCheckout({ lineItems: [dummyLineItemAdd] })
	// 	})
	// 	await wait()
	// 	expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(2)
	// })
	//
	// it('[addItemToCheckout] should add a single item to the current checkout', async () => {
	// 	const queries = createMockQueries()
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	await wait()
	// 	act(() => {
	// 		result.current.addItemToCheckout({ ...dummyLineItemAdd, quantity: 3 })
	// 	})
	// 	await wait()
	// 	expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(1)
	// })
	//
	// it('[updateQuantity] should update the quantity of a given variant', async () => {
	// 	const queries = createMockQueries()
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	await wait()
	// 	act(() => {
	// 		result.current.addToCheckout({ lineItems: [dummyLineItemAdd] })
	// 	})
	// 	await wait()
	// 	act(() => {
	// 		result.current.updateQuantity({ id: '123', quantity: 100 })
	// 	})
	// 	await wait()
	// 	expect(queries.checkoutLineItemsUpdate).toHaveBeenCalledTimes(1)
	// 	expect(queries.checkoutLineItemsUpdate).toHaveBeenCalledWith({
	// 		checkoutId: 'foo',
	// 		lineItems: [{ quantity: 100, id: '123' }],
	// 	})
	// })
	//
	// it('[applyDiscount] should create a checkout if none exists', async () => {
	// 	const queries = createMockQueries(false)
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	await wait()
	// 	act(() => {
	// 		result.current.applyDiscount('specialDiscount')
	// 	})
	// 	await wait()
	// 	await wait()
	//
	// 	if (!result.current.checkout) throw new Error('checkout was not created')
	// 	expect(queries.checkoutCreate).toHaveBeenCalledTimes(1)
	// 	expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledTimes(1)
	// 	expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledWith({
	// 		checkoutId: 'foo',
	// 		discountCode: 'specialDiscount',
	// 	})
	// 	expect(result.current.checkout.id).toBe('foo')
	// })
	//
	// it('[applyDiscount] should create a checkout if none exists', async () => {
	// 	const queries = createMockQueries()
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	await wait()
	// 	act(() => {
	// 		result.current.applyDiscount('specialDiscount')
	// 	})
	// 	await wait()
	// 	await wait()
	//
	// 	if (!result.current.checkout) throw new Error('checkout was not created')
	// 	expect(queries.checkoutCreate).toHaveBeenCalledTimes(0)
	// 	expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledTimes(1)
	// 	expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledWith({
	// 		checkoutId: 'foo',
	// 		discountCode: 'specialDiscount',
	// 	})
	// 	expect(result.current.checkout.id).toBe('foo')
	// })
	//
	// it('[removeDiscount] should remove the current discount code', async () => {
	// 	const queries = createMockQueries()
	// 	const { result } = renderHook(() => useCheckout(queries))
	// 	act(() => {
	// 		result.current.addToCheckout({ lineItems: [dummyLineItemAdd] })
	// 	})
	// 	await wait()
	// 	act(() => {
	// 		result.current.applyDiscount('specialDiscount')
	// 	})
	//
	// 	await wait()
	// 	act(() => {
	// 		result.current.removeDiscount()
	// 	})
	// 	await wait()
	//
	// 	if (!result.current.checkout) throw new Error('checkout was not created')
	// 	expect(queries.checkoutDiscountCodeRemove).toHaveBeenCalledWith({
	// 		checkoutId: 'foo',
	// 	})
	// })
	//
})
