import { Paginated } from '@good-idea/unwind-edges'
import { MailingAddress } from './customer'
import { Variant } from './product'
import { MoneyV2, CurrencyCode } from './money'

interface AppliedGiftCard {
  __typename: string
  amountUsedV2: MoneyV2
  balanceV2: MoneyV2
  id: string
  lastCharacters: string
}

interface ShippingRate {
  __typename: string
  handle: string
  priceV2: MoneyV2
  title: string
}

interface AvailableShippingRates {
  __typename: string
  ready: boolean
  shippingRates: ShippingRate[]
}

interface Attribute {
  key: string
  value: string
}

interface PricingPercentageValue {
  __typename: string
  percentage: number
}

type PricingValue = MoneyV2 | PricingPercentageValue

export interface DiscountApplication {
  __typename: string
  allocationMethod: 'ACROSS' | 'EACH' | 'ONE'
  targetSelection: 'ALL' | 'ENTITLED' | 'EXPLICIT'
  targetType: 'LINE_ITEM' | 'SHIPPING_LINE'
  value: PricingValue
  code?: string
}

interface DiscountAllocation {
  __typename: string
  allocatedAmount: MoneyV2
  discountApplication: DiscountApplication
}

export interface CheckoutLineItem {
  __typename: 'CheckoutLineItem'
  id: string
  quantity: number
  title: string
  variant: Variant
  customAttributes?: Attribute[]
  discountAllocations?: DiscountAllocation[]
}

export interface OrderLineItem {
  __typename: string
  customAttributes: Attribute[]
  discountAllocations: DiscountAllocation[]
  quanity: number
  title: string
  variant: Variant
}

export interface Order {
  __typename: string
  currencyCode: CurrencyCode
  customerLocale: string
  customerUrl: string
  discountApplications: DiscountAllocation[]
  email: string
  id: string
  lineItems: OrderLineItem[]
}

export interface Checkout {
  __typename: string
  appliedGiftCards?: AppliedGiftCard[]
  availableShippingRates?: AvailableShippingRates
  completedAt?: Date
  createdAt?: Date
  currencyCode?: CurrencyCode
  customAttributes?: Attribute[]
  discountApplications?: DiscountApplication[]
  email?: string
  id: string
  lineItems: Paginated<CheckoutLineItem>
  note?: string
  order?: Order
  orderStatusUrl?: string | null
  paymentDueV2?: MoneyV2
  ready?: boolean
  requiresShipping?: boolean
  shippingAddress?: MailingAddress
  shippingDiscountAllocations?: DiscountAllocation[]
  shippingLine?: ShippingRate
  subtotalPriceV2?: MoneyV2
  taxExempt?: boolean
  taxesIncluded?: boolean
  totalPriceV2?: MoneyV2
  totalTaxV2?: MoneyV2
  updatedAt?: Date
  webUrl?: string
}

export interface MailingAddressInput {
  address1?: string
  address2?: string
  city?: string
  company?: string
  country?: string
  firstName?: string
  phone?: string
  provice?: string
  zip?: string
}

export interface AttributeInput {
  key: string
  value: string
}

export interface CheckoutLineItemInput {
  variantId: string
  quantity: number
  customAttributes?: AttributeInput[]
}

export interface CheckoutLineItemUpdateInput {
  id?: string
  variantId?: string
  quantity: number
  customAttributes?: AttributeInput[]
}

export interface UserError {
  __typename: string
  code: string
  field: string[]
  message: string
}

export type CheckoutResponse<Key extends string> = {
  [K in Key]: {
    checkout?: Checkout
    checkoutUserErrors?: UserError[]
  }
}
