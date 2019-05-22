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

interface CreateCheckoutArgs extends Partial<AddToCheckoutArgs> {
  // shippingAddress: Address
}

interface CheckoutState {
  loading: boolean;
  userErrors: UserError[];
  currentCheckout: Checkout | void;
}

export interface UseCheckoutProps extends CheckoutState {
  addToCheckout: (args: AddToCheckoutArgs) => Promise<void>;
  addItemToCheckout: (args: AddLineItem) => Promise<void>;
  updateQuantity: (item: CheckoutLineItem, qty: number) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
}

/**
 * Setup
 */

const { useReducer } = React;

const initialState = {
  loading: false,
  userErrors: [],
  currentCheckout: undefined
};

/**
 * State
 */

interface Action {
  type: string;
  currentCheckout?: Checkout;
  userErrors?: UserError[];
}

const STARTED_REQUEST = 'STARTED_REQUEST';
const FINISHED_REQUEST = 'FINISHED_REQUEST';

const reducer = (state: CheckoutState, action: Action): CheckoutState => {
  switch (action.type) {
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
   * Private Methods
   */

  const getOrcreateCheckout = async (args: CreateCheckoutArgs) => {
    dispatch({ type: STARTED_REQUEST });
    if (currentCheckout) return currentCheckout;
    const result = await createMutation({ ...args });
    return result.data.checkoutCreate;
  };

  /**
   * Public Methods
   */

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
    dispatch({ type: FINISHED_REQUEST, ...result.data[resultKey] });
  };

  const addItemToCheckout = async (lineItem: AddLineItem) =>
    addToCheckout({ lineItems: [lineItem] });

  const updateQuantity = async (item: CheckoutLineItem, quantity: number) => {
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
    const checkout = await getOrcreateCheckout({});
    const checkoutId = checkout.id;
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
    console.log(result.data.checkoutDiscountCodeRemove);
    dispatch({
      type: FINISHED_REQUEST,
      ...result.data.checkoutDiscountCodeRemove
    });
  };

  const value = {
    ...state,
    addToCheckout,
    addItemToCheckout,
    updateQuantity,
    applyDiscount,
    removeDiscount
  };

  return value;
};
