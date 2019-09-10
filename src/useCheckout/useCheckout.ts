import * as React from 'react'
import { DocumentNode } from 'graphql'
import {
  UserError,
  QueryFunction,
  Checkout,
  CheckoutLineItemInput,
  CheckoutLineItemUpdateInput,
} from '../types'
import {
  defaultQueries,
  CheckoutCreateInput,
  CheckoutCreateResponse,
  CheckoutFetchInput,
  CheckoutFetchResponse,
  CheckoutDiscountCodeApplyInput,
  CheckoutDiscountCodeApplyResponse,
  CheckoutDiscountCodeRemoveInput,
  CheckoutDiscountCodeRemoveResponse,
  CheckoutLineItemsAddInput,
  CheckoutLineItemsAddResponse,
  CheckoutLineItemsUpdateInput,
  CheckoutLineItemsUpdateResponse,
} from './queries'
import {
  reducer,
  STARTED_REQUEST,
  FETCHED_CHECKOUT,
  CREATED_CHECKOUT,
  APPLIED_DISCOUNT,
  REMOVED_DISCOUNT,
  ADDED_LINE_ITEMS,
  UPDATED_LINE_ITEMS,
  CART_CLEARED,
  // RECEIVED_ERRORS,
} from './reducer'
import { VIEWER_CART_TOKEN, setCookie, getCookie } from '../utils/storage'

const { useReducer, useEffect } = React

/**
 * API
 */

export interface UseCheckoutConfig {
  /* dummy config for now */
  foo?: string
}

interface UseCheckoutArguments {
  query: QueryFunction
  queries?: Partial<UseCheckoutQueries>
  config?: Partial<UseCheckoutConfig>
}

export interface UseCheckoutQueries {
  CHECKOUT_CREATE: string | DocumentNode
  CHECKOUT_FETCH: string | DocumentNode
  CHECKOUT_DISCOUNT_CODE_APPLY: string | DocumentNode
  CHECKOUT_DISCOUNT_CODE_REMOVE: string | DocumentNode
  CHECKOUT_LINE_ITEMS_ADD: string | DocumentNode
  CHECKOUT_LINE_ITEMS_UPDATE: string | DocumentNode
}

export interface UseCheckoutValues extends CheckoutState {
  /* All of CheckoutState, and */
  /* Base Methods */
  checkoutCreate: (args: CheckoutCreateInput) => Promise<CheckoutAndErrors>
  checkoutLineItemsAdd: (lineItems: CheckoutLineItemInput[]) => Promise<void>
  checkoutLineItemsUpdate: (
    lineItems: CheckoutLineItemUpdateInput[],
  ) => Promise<void>
  checkoutDiscountCodeApply: (discountCode: string) => Promise<void>
  checkoutDiscountCodeRemove: () => Promise<void>

  /* Shortcut Methods */
  addLineItem: (lineItem: CheckoutLineItemInput) => Promise<void>
  updateLineItem: (lineItem: CheckoutLineItemUpdateInput) => Promise<void>
  clearCheckout: () => Promise<void>
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

export interface CheckoutState {
  loading: boolean
  ready: boolean
  checkoutUserErrors: UserError[]
  checkout: Checkout | void
}

/**
 * Helper Functions
 */

const setViewerCartCookie = (token: string) =>
  setCookie(VIEWER_CART_TOKEN, token)

const getViewerCartCookie = () => getCookie<string>(VIEWER_CART_TOKEN)

interface CheckoutAndErrors {
  checkout?: Checkout
  checkoutUserErrors?: UserError[]
}

export const useCheckout = ({
  queries: userQueries,
  query,
}: UseCheckoutArguments): UseCheckoutValues => {
  const {
    CHECKOUT_CREATE,
    CHECKOUT_FETCH,
    CHECKOUT_DISCOUNT_CODE_APPLY,
    CHECKOUT_DISCOUNT_CODE_REMOVE,
    CHECKOUT_LINE_ITEMS_ADD,
    CHECKOUT_LINE_ITEMS_UPDATE,
  } = {
    ...defaultQueries,
    ...userQueries,
  }

  /**
   * State
   */

  const [state, dispatch] = useReducer(reducer, initialState)
  /**
   * Base Methods
   *
   * These methods query the Shopify API. Their names should match the names of the
   * available queries & mutations.
   *
   */

  const checkoutCreate = async (variables?: CheckoutCreateInput) => {
    if (state.checkout) return { checkout: state.checkout }
    const result = await query<CheckoutCreateResponse, CheckoutCreateInput>(
      CHECKOUT_CREATE,
      variables || {},
    )

    const { checkoutCreate: checkoutCreateResponse } = result.data

    if (checkoutCreateResponse.checkout)
      setViewerCartCookie(checkoutCreateResponse.checkout.id)
    dispatch({ type: CREATED_CHECKOUT, ...checkoutCreateResponse })
    return checkoutCreateResponse
  }

  const getOrCreateCheckout = async (variables?: CheckoutCreateInput) =>
    state.checkout
      ? {
          checkout: state.checkout,
          checkoutUserErrors: state.checkoutUserErrors,
        }
      : checkoutCreate(variables)

  const fetchCheckout = async () => {
    const checkoutToken = getViewerCartCookie()
    if (checkoutToken) {
      /* If a token exists, fetch it from Shopify */
      const variables = { id: checkoutToken }
      const result = await query<CheckoutFetchResponse, CheckoutFetchInput>(
        CHECKOUT_FETCH,
        variables,
      )
      const checkout = result.data ? result.data.node : undefined
      dispatch({ type: FETCHED_CHECKOUT, checkout })
    } else {
      /* When no token exists, dispatch this to set "loading" to false. */
      /* This might deserve its own action type, "NOTHING_TO_FETCH" */
      dispatch({ type: FETCHED_CHECKOUT, checkout: undefined })
    }
  }

  const checkoutLineItemsAdd = async (lineItems: CheckoutLineItemInput[]) => {
    const { checkout } = await getOrCreateCheckout()
    if (!checkout)
      throw new Error(
        'checkoutLineItemsAdd was called before a checkout was created.',
      )
    dispatch({ type: STARTED_REQUEST })

    const variables = { lineItems, checkoutId: checkout.id }
    const result = await query<
      CheckoutLineItemsAddResponse,
      CheckoutLineItemsAddInput
    >(CHECKOUT_LINE_ITEMS_ADD, variables)
    dispatch({ type: ADDED_LINE_ITEMS, ...result.data.checkoutLineItemsAdd })
  }

  const checkoutLineItemsUpdate = async (
    lineItems: CheckoutLineItemUpdateInput[],
  ) => {
    const { checkout } = await getOrCreateCheckout()
    if (!checkout) throw new Error('There is no checkout to update')
    dispatch({ type: STARTED_REQUEST })
    const result = await query<
      CheckoutLineItemsUpdateResponse,
      CheckoutLineItemsUpdateInput
    >(CHECKOUT_LINE_ITEMS_UPDATE, {
      lineItems,
      checkoutId: checkout.id,
    })

    dispatch({
      type: UPDATED_LINE_ITEMS,
      ...result.data.checkoutLineItemsUpdate,
    })
  }

  const checkoutDiscountCodeApply = async (discountCode: string) => {
    const { checkout } = await getOrCreateCheckout()
    if (!checkout)
      throw new Error(
        'checkoutDiscountCodeApply was called before a checkout was created.',
      )
    dispatch({ type: STARTED_REQUEST })
    const result = await query<
      CheckoutDiscountCodeApplyResponse,
      CheckoutDiscountCodeApplyInput
    >(CHECKOUT_DISCOUNT_CODE_APPLY, {
      checkoutId: checkout.id,
      discountCode,
    })
    dispatch({
      type: APPLIED_DISCOUNT,
      ...result.data.checkoutDiscountCodeApplyV2,
    })
  }

  const checkoutDiscountCodeRemove = async () => {
    const { checkout } = await getOrCreateCheckout()
    if (!checkout)
      throw new Error(
        'checkoutDiscountCodeRemove was called before a checkout was created.',
      )

    dispatch({ type: STARTED_REQUEST })
    const result = await query<
      CheckoutDiscountCodeRemoveResponse,
      CheckoutDiscountCodeRemoveInput
    >(CHECKOUT_DISCOUNT_CODE_REMOVE, {
      checkoutId: checkout.id,
    })
    dispatch({
      type: REMOVED_DISCOUNT,
      ...result.data.checkoutDiscountCodeRemove,
    })
  }

  /**
   * Shortcut Methods
   *
   * These methods implement the base methods to provide simpler "shortcut"
   * functions with a simpler API
   */

  /* Adds a single line item to the checkout */
  const addLineItem = async (lineItem: CheckoutLineItemInput) =>
    checkoutLineItemsAdd([lineItem])

  /* Updates a single line item */
  const updateLineItem = async (lineItem: CheckoutLineItemUpdateInput) =>
    checkoutLineItemsUpdate([lineItem])

  /* Clears the cart */
  const clearCheckout = async () => dispatch({ type: CART_CLEARED })

  /**
   * Effects
   */

  useEffect(() => {
    fetchCheckout()
  }, []) // fetch the checkout on load

  const value = {
    ...state,
    /* Base Methods */
    checkoutCreate,
    checkoutLineItemsAdd,
    checkoutLineItemsUpdate,
    checkoutDiscountCodeApply,
    checkoutDiscountCodeRemove,

    /* Shortcut Methods */
    addLineItem,
    updateLineItem,
    clearCheckout,
  }

  return value
}
