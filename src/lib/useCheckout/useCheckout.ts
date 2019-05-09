import * as React from 'react';
import { useMutation } from 'urql';
import { Checkout, CheckoutLineItem } from '../types';

import {
  ADD_MUTATION,
  APPLY_DISCOUNT_MUTATION,
  CREATE_MUTATION,
  REMOVE_DISCOUNT_MUTATION,
  UPDATE_LINE_ITEM_MUTATION
} from './mutations';

interface UserError {
  field: string;
  message: string;
}

interface AddLineItem {
  variantId: string;
  quantity: number;
}

interface AddToCheckoutArgs {
  lineItems: AddLineItem[];
  email?: string;
  note?: string;
}

interface CheckoutState {
  loading: boolean;
  isOpen: boolean;
  userErrors: UserError[];
  currentCheckout: Checkout | void;
}

export interface UseCheckoutProps extends CheckoutState {
  openCheckout: () => void;
  closeCheckout: () => void;
  addToCheckout: (args: AddToCheckoutArgs) => Promise<void>;
  updateQuantity: (item: CheckoutLineItem) => (qty: number) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
}

/**
 * Setup
 */

const { useReducer } = React;

const initialState = {
  loading: false,
  isOpen: false,
  userErrors: [],
  currentCheckout: undefined
};

export const defaultCheckoutProps = {
  ...initialState,
  addToCheckout: async () => undefined,
  applyDiscount: async () => undefined,
  closeCheckout: () => undefined,
  openCheckout: () => undefined,
  removeDiscount: async () => undefined,
  updateQuantity: () => async () => undefined
};

/**
 * State
 */

interface Action {
  type: string;
  currentCheckout?: Checkout;
  userErrors?: UserError[];
}

const OPEN_CHECKOUT = 'OPEN_CHECKOUT';
const CLOSE_CHECKOUT = 'CLOSE_CHECKOUT';
const STARTED_REQUEST = 'STARTED_REQUEST';
const FINISHED_REQUEST = 'FINISHED_REQUEST';

const reducer = (state: CheckoutState, action: Action): CheckoutState => {
  switch (action.type) {
    case OPEN_CHECKOUT:
      return { ...state, isOpen: true };
    case CLOSE_CHECKOUT:
      return { ...state, isOpen: false };
    case STARTED_REQUEST:
      return { ...state, loading: true };
    case FINISHED_REQUEST:
      const { userErrors, currentCheckout } = action;
      return { ...state, userErrors, currentCheckout };
    default:
      return state;
  }
};

export const useCheckout = (): UseCheckoutProps => {
  /**
   * Hooks setup
   */
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, addMutation] = useMutation(ADD_MUTATION);
  const [, createMutation] = useMutation(CREATE_MUTATION);
  const [, updateLineItemMutation] = useMutation(UPDATE_LINE_ITEM_MUTATION);
  const [, applyDiscountMutation] = useMutation(APPLY_DISCOUNT_MUTATION);
  const [, removeDiscountMutation] = useMutation(REMOVE_DISCOUNT_MUTATION);

  const { currentCheckout } = state;
  const checkoutId = currentCheckout ? currentCheckout.id : undefined;

  /**
   * Methods
   */

  const openCheckout = () => dispatch({ type: OPEN_CHECKOUT });
  const closeCheckout = () => dispatch({ type: CLOSE_CHECKOUT });

  const addToCheckout = async (args: AddToCheckoutArgs) => {
    const checkoutExists = Boolean(currentCheckout);
    const mutate = checkoutExists ? addMutation : createMutation;
    const variables = checkoutExists ? { checkoutId, ...args } : args;

    dispatch({ type: STARTED_REQUEST });
    const result = await mutate({
      variables
    });
    const resultKey = checkoutExists
      ? 'checkoutLineItemsAdd'
      : 'checkoutCreate';
    // const { userErrors, checkout } = result.data.checkoutLineItemsAdd
    dispatch({ type: FINISHED_REQUEST, ...result.data[resultKey] });
  };

  const updateQuantity = (item: CheckoutLineItem) => async (
    quantity: number
  ) => {
    if (!currentCheckout) throw new Error('There is no checkout to update');
    dispatch({ type: STARTED_REQUEST });
    const result = await updateLineItemMutation({
      variables: {
        checkoutId,
        lineItems: [{ id: item.id, variantId: item.variant.id, quantity }]
      }
    });
    dispatch({
      type: FINISHED_REQUEST,
      ...result.data.checkoutLineItemsUpdate
    });
  };

  const applyDiscount = async (discountCode: string) => {
    dispatch({ type: STARTED_REQUEST });
    const result = await applyDiscountMutation({
      variables: {
        checkoutId,
        discountCode
      }
    });
    dispatch({
      type: FINISHED_REQUEST,
      ...result.data.checkoutDiscountCodeApplyV2
    });
  };

  const removeDiscount = async () => {
    dispatch({ type: STARTED_REQUEST });
    const result = await removeDiscountMutation({
      variables: {
        checkoutId
      }
    });
    dispatch({
      type: FINISHED_REQUEST,
      ...result.data.checkoutDiscountCodeRemove
    });
  };

  const value = {
    ...state,
    openCheckout,
    closeCheckout,
    addToCheckout,
    updateQuantity,
    applyDiscount,
    removeDiscount
  };

  return value;
};
