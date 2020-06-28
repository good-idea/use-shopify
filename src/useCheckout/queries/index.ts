import { CHECKOUT_CREATE } from './checkoutCreate'
import { CHECKOUT_DISCOUNT_CODE_APPLY } from './checkoutDiscountCodeApply'
import { CHECKOUT_DISCOUNT_CODE_REMOVE } from './checkoutDiscountCodeRemove'
import { CHECKOUT_LINE_ITEMS_UPDATE } from './checkoutLineItemsUpdate'
import { CHECKOUT_LINE_ITEMS_ADD } from './checkoutLineItemsAdd'
import { CHECKOUT_FETCH } from './checkoutFetch'
import { CHECKOUT_ATTRIBUTES_UPDATE } from './checkoutAttributesUpdate'

export * from './checkoutCreate'
export * from './checkoutDiscountCodeApply'
export * from './checkoutDiscountCodeRemove'
export * from './checkoutLineItemsAdd'
export * from './checkoutLineItemsUpdate'
export * from './checkoutFetch'
export * from './checkoutAttributesUpdate'

export const defaultQueries = {
  CHECKOUT_CREATE,
  CHECKOUT_DISCOUNT_CODE_REMOVE,
  CHECKOUT_DISCOUNT_CODE_APPLY,
  CHECKOUT_LINE_ITEMS_UPDATE,
  CHECKOUT_LINE_ITEMS_ADD,
  CHECKOUT_FETCH,
  CHECKOUT_ATTRIBUTES_UPDATE,
}
