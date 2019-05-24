import { Checkout } from '../../types';

export interface MailingAddressInput {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  phone?: string;
  provice?: string;
  zip?: string;
}

export interface AttributeInput {
  key: string;
  value: string;
}

export interface CheckoutLineItemInput {
  customAttributes?: AttributeInput[];
  quantity: number;
  variantId: string;
}

export interface UserError {
  code: string;
  field: string[];
  message: string;
}

export type CheckoutResponse<Key extends string> = Promise<{
  data: {
    [K in Key]: {
      checkout?: Checkout;
      checkoutUserErrors?: UserError[];
    }
  };
}>;
