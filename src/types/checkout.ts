import { Paginated } from '@good-idea/unwind-edges'
import { MailingAddress } from './customer'
import { Variant } from './product'
import { MoneyV2, CurrencyCode } from './money'

interface AppliedGiftCard {
	amountUsedV2: MoneyV2
	balanceV2: MoneyV2
	id: string
	lastCharacters: string
}

interface ShippingRate {
	handle: string
	priceV2: MoneyV2
	title: string
}

interface AvailableShippingRates {
	ready: boolean
	shippingRates: ShippingRate[]
}

interface Attribute {
	key: string
	value: string
}

interface PricingPercentageValue {
	percentage: number
}

type PricingValue = MoneyV2 | PricingPercentageValue

export interface DiscountApplication {
	allocationMethod: 'ACROSS' | 'EACH' | 'ONE'
	targetSelection: 'ALL' | 'ENTITLED' | 'EXPLICIT'
	targetType: 'LINE_ITEM' | 'SHIPPING_LINE'
	value: PricingValue
	code?: string
}

interface DiscountAllocation {
	allocatedAmount: MoneyV2
	discountApplication: DiscountApplication
}

export interface CheckoutLineItem {
	id: string
	quantity: number
	title: string
	variant: Variant
	customAttributes?: Attribute[]
	discountAllocations?: DiscountAllocation[]
}

export interface OrderLineItem {
	customAttributes: Attribute[]
	discountAllocations: DiscountAllocation[]
	quanity: number
	title: string
	variant: Variant
}

export interface Order {
	currencyCode: CurrencyCode
	customerLocale: string
	customerUrl: string
	discountApplications: DiscountAllocation[]
	email: string
	id: string
	lineItems: OrderLineItem[]
}

export interface Checkout {
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
