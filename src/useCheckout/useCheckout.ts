import * as React from 'react'
import { Omit } from 'utility-types'
import { Checkout } from '../types'
import {
	FetchCheckout,
	CheckoutCreate,
	CheckoutCreateInput,
	CheckoutLineItemsAddInput,
	CheckoutLineItemsAdd,
	CheckoutLineItemInput,
	CheckoutLineItemsUpdate,
	CheckoutDiscountCodeApply,
	CheckoutDiscountCodeRemove,
	UserError,
} from '../graphql/queries'
import { VIEWER_CART_TOKEN, setCookie, getCookie } from '../utils/storage'

const { useReducer, useEffect } = React

interface CheckoutState {
	loading: boolean
	ready: boolean
	checkoutUserErrors: UserError[]
	checkout: Checkout | void
}

/**
 * Setup
 */

const initialState = {
	ready: false,
	loading: true,
	checkoutUserErrors: [],
	checkout: undefined,
}

/**
 * State
 */

interface Action {
	type: string
	checkout?: Checkout
	checkoutUserErrors?: UserError[]
}

const STARTED_REQUEST = 'STARTED_REQUEST'
const FINISHED_REQUEST = 'FINISHED_REQUEST'

const reducer = (state: CheckoutState, action: Action): CheckoutState => {
	switch (action.type) {
		case STARTED_REQUEST:
			return { ...state, loading: true }
		case FINISHED_REQUEST:
			const { checkoutUserErrors, checkout } = action
			return {
				...state,
				checkoutUserErrors: checkoutUserErrors || [],
				checkout,
				loading: false,
				ready: true,
			}
		default:
			return state
	}
}

/**
 * Helper Functions
 */

const setViewerCartCookie = (token: string) => setCookie(VIEWER_CART_TOKEN, token)
const getViewerCartCookie = () => getCookie<string>(VIEWER_CART_TOKEN)
// const removeViewerCartCookie = () => removeCookie(VIEWER_CART_TOKEN);

export interface UseCheckoutQueries {
	fetchCheckout: FetchCheckout
	checkoutCreate: CheckoutCreate
	checkoutLineItemsUpdate: CheckoutLineItemsUpdate
	checkoutLineItemsAdd: CheckoutLineItemsAdd
	checkoutDiscountCodeApply: CheckoutDiscountCodeApply
	checkoutDiscountCodeRemove: CheckoutDiscountCodeRemove
}

type AddToCheckoutInput = Omit<CheckoutLineItemsAddInput, 'checkoutId'>

export interface UseCheckoutValues extends CheckoutState {
	addToCheckout: (args: AddToCheckoutInput) => Promise<void>
	addItemToCheckout: (args: CheckoutLineItemInput) => Promise<void>
	updateQuantity: (variantId: string, quantity: number) => Promise<void>
	applyDiscount: (code: string) => Promise<void>
	removeDiscount: () => Promise<void>
}

export const useCheckout = ({
	fetchCheckout,
	checkoutCreate,
	checkoutLineItemsAdd,
	checkoutLineItemsUpdate,
	checkoutDiscountCodeApply,
	checkoutDiscountCodeRemove,
}: UseCheckoutQueries): UseCheckoutValues => {
	/**
	 * Hooks setup
	 */

	const [state, dispatch] = useReducer(reducer, initialState)

	/**
	 * Private Methods
	 */

	const getOrCreateCheckout = async (variables?: CheckoutCreateInput) => {
		if (state.checkout) return { checkout: state.checkout }

		const result = await checkoutCreate(variables)
		if (result.data.checkoutCreate.checkout) setViewerCartCookie(result.data.checkoutCreate.checkout.id)
		return result.data.checkoutCreate
	}

	/**
	 * On load, fetch the checkout if a token exists
	 */

	useEffect(() => {
		const fetchInitialCheckout = async () => {
			const checkoutToken = getViewerCartCookie()
			console.log(checkoutToken)
			if (checkoutToken) {
				const variables = { id: checkoutToken }
				const result = await fetchCheckout(variables)
				const checkout = result.data ? result.data.node : undefined
				dispatch({ type: FINISHED_REQUEST, checkout })
			} else {
				dispatch({ type: FINISHED_REQUEST, checkout: undefined })
			}
		}
		fetchInitialCheckout()
	}, [])

	/**
	 * Public Methods
	 */

	const addToCheckout = async (args: AddToCheckoutInput) => {
		dispatch({ type: STARTED_REQUEST })
		const { checkout, checkoutUserErrors } = await getOrCreateCheckout()
		if (checkoutUserErrors) {
			dispatch({ type: FINISHED_REQUEST, checkout, checkoutUserErrors })
		} else {
			const variables = { checkoutId: checkout.id, ...args }
			const result = await checkoutLineItemsAdd(variables)
			dispatch({ type: FINISHED_REQUEST, ...result.data.checkoutLineItemsAdd })
		}
	}

	const addItemToCheckout = async (lineItem: CheckoutLineItemInput) => addToCheckout({ lineItems: [lineItem] })

	const updateQuantity = async (variantId: string, quantity: number) => {
		const { checkout } = await getOrCreateCheckout()
		if (!checkout) throw new Error('There is no checkout to update')
		dispatch({ type: STARTED_REQUEST })
		const result = await checkoutLineItemsUpdate({
			checkoutId: checkout.id,
			lineItems: [{ variantId, quantity }],
		})
		dispatch({
			type: FINISHED_REQUEST,
			...result.data.checkoutLineItemsUpdate,
		})
	}

	const applyDiscount = async (discountCode: string) => {
		const { checkout } = await getOrCreateCheckout()
		dispatch({ type: STARTED_REQUEST })
		const result = await checkoutDiscountCodeApply({
			checkoutId: checkout.id,
			discountCode,
		})
		dispatch({
			type: FINISHED_REQUEST,
			...result.data.checkoutDiscountCodeApplyV2,
		})
	}

	const removeDiscount = async () => {
		const { checkout } = await getOrCreateCheckout()

		dispatch({ type: STARTED_REQUEST })
		const result = await checkoutDiscountCodeRemove({
			checkoutId: checkout.id,
		})
		dispatch({
			type: FINISHED_REQUEST,
			...result.data.checkoutDiscountCodeRemove,
		})
	}

	const value = {
		...state,
		addToCheckout,
		addItemToCheckout,
		updateQuantity,
		applyDiscount,
		removeDiscount,
	}

	return value
}
