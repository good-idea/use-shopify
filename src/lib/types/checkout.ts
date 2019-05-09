import { Money, Variant } from './product';
import { MailingAddress } from './customer';

interface AppliedGiftCard {
  amountUsed: Money;
  balance: Money;
  id: string;
  lastCharacters: string;
}

interface ShippingRate {
  handle: string;
  price: Money;
  title: string;
}

interface AvailableShippingRates {
  ready: boolean;
  shippingRates: ShippingRate[];
}

interface Attribute {
  key: string;
  value: string;
}

type CurrencyCode = 'USD';

interface MoneyV2 {
  amount: string;
  currencyCode: CurrencyCode;
}

interface PricingPercentageValue {
  percentage: number;
}

type PricingValue = MoneyV2 | PricingPercentageValue;

export interface DiscountApplication {
  allocationMethod: 'ACROSS' | 'EACH' | 'ONE';
  targetSelection: 'ALL' | 'ENTITLED' | 'EXPLICIT';
  targetType: 'LINE_ITEM' | 'SHIPPING_LINE';
  value: PricingValue;
  code?: string;
}

interface DiscountAllocation {
  allocatedAmount: MoneyV2;
  discountApplication: DiscountApplication;
}

export interface CheckoutLineItem {
  id: string;
  quantity: number;
  title: string;
  variant: Variant;
  customAttributes?: Attribute[];
  discountAllocations?: DiscountAllocation[];
}

export interface OrderLineItem {
  customAttributes: Attribute[];
  discountAllocations: DiscountAllocation[];
  quanity: number;
  title: string;
  variant: Variant;
}

export interface Order {
  currencyCode: CurrencyCode;
  customerLocale: string;
  customerUrl: string;
  discountApplications: DiscountAllocation[];
  email: string;
  id: string;
  lineItems: OrderLineItem[];
}

export interface Checkout {
  appliedGiftCards?: AppliedGiftCard[];
  availableShippingRates?: AvailableShippingRates;
  completedAt?: Date;
  createdAt?: Date;
  currencyCode?: CurrencyCode;
  customAttributes?: Attribute[];
  discountApplications?: DiscountApplication[];
  email?: string;
  id: string;
  lineItems: CheckoutLineItem[];
  note?: string;
  order?: Order;
  orderStatusUrl?: string | null;
  paymentDue?: Money;
  ready?: boolean;
  requiresShipping?: boolean;
  shippingAddress?: MailingAddress;
  shippingDiscountAllocations?: DiscountAllocation[];
  shippingLine?: ShippingRate;
  subtotalPrice?: Money;
  taxExempt?: boolean;
  taxesIncluded?: boolean;
  totalPrice?: Money;
  totalTax?: Money;
  updatedAt?: Date;
  webUrl?: string;
}
