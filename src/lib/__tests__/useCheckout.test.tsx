import { act, renderHook } from 'react-hooks-testing-library';
import { wait, cleanup } from 'react-testing-library';
import { useCheckout } from '../useCheckout';
import { dummyProduct } from './stubs';

jest.useFakeTimers();

const dummyVariant = dummyProduct.variants.edges[0].node;
const dummyLineItemAdd = { variantId: dummyVariant.id, quantity: 1 };

const dummyCheckout = {
  id: 'foo'
};

const dummyResponse = (key: string) => ({
  data: {
    [key]: {
      checkout: dummyCheckout
    }
  }
});

const createMockQueries = (withExistingCheckout: boolean = true) => ({
  fetchCheckout: jest.fn().mockResolvedValue({
    data: withExistingCheckout
      ? {
          node: dummyCheckout
        }
      : undefined
  }),
  checkoutCreate: jest.fn().mockResolvedValue(dummyResponse('checkoutCreate')),
  checkoutLineItemsAdd: jest.fn().mockImplementation(async ({ lineItems }) => ({
    data: {
      checkoutLineItemsAdd: {
        checkout: {
          ...dummyCheckout,
          lineItems
        }
      }
    }
  })),
  checkoutLineItemsUpdate: jest
    .fn()
    .mockResolvedValue(dummyResponse('checkoutLineItemsUpdate')),
  checkoutDiscountCodeApply: jest
    .fn()
    .mockResolvedValue(dummyResponse('checkoutDiscountCodeApplyV2')),
  checkoutDiscountCodeRemove: jest
    .fn()
    .mockResolvedValue(dummyResponse('checkoutDiscountCodeRemove'))
});

describe('useCheckout', () => {
  afterEach(() => {
    cleanup();
  });

  it('[addToCheckout] should create a new checkout if none exists', async () => {
    const queries = createMockQueries(false);
    const { result } = renderHook(() => useCheckout(queries));
    const { checkout, addToCheckout } = result.current;

    await wait();
    expect(checkout).toBe(undefined);
    act(() => {
      addToCheckout({ lineItems: [dummyLineItemAdd] });
    });

    await wait();
    if (!result.current.checkout) throw new Error('checkout was not created');
    expect(queries.checkoutCreate).toHaveBeenCalledTimes(1);
    expect(result.current.checkout.id).toBe('foo');
  });

  it('[addToCheckout] should add new items to the current checkout', async () => {
    const queries = createMockQueries();
    const { result } = renderHook(() => useCheckout(queries));
    await wait();

    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    expect(queries.checkoutCreate).toHaveBeenCalledTimes(0);
    expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(2);
  });

  it('[addItemToCheckout] should add a single item to the current checkout', async () => {
    const queries = createMockQueries();
    const { result } = renderHook(() => useCheckout(queries));
    await wait();
    act(() => {
      result.current.addItemToCheckout({ ...dummyLineItemAdd, quantity: 3 });
    });
    await wait();
    expect(queries.checkoutLineItemsAdd).toHaveBeenCalledTimes(1);
  });

  it('[updateQuantity] should update the quantity of a given variant', async () => {
    const queries = createMockQueries();
    const { result } = renderHook(() => useCheckout(queries));
    await wait();
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    act(() => {
      result.current.updateQuantity('123', 100);
    });
    await wait();
    expect(queries.checkoutLineItemsUpdate).toHaveBeenCalledTimes(1);
    expect(queries.checkoutLineItemsUpdate).toHaveBeenCalledWith({
      checkoutId: 'foo',
      lineItems: [{ quantity: 100, variantId: '123' }]
    });
  });

  it('[applyDiscount] should create a checkout if none exists', async () => {
    const queries = createMockQueries(false);
    const { result } = renderHook(() => useCheckout(queries));
    await wait();
    act(() => {
      result.current.applyDiscount('specialDiscount');
    });
    await wait();
    await wait();

    if (!result.current.checkout) throw new Error('checkout was not created');
    expect(queries.checkoutCreate).toHaveBeenCalledTimes(1);
    expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledTimes(1);
    expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledWith({
      checkoutId: 'foo',
      discountCode: 'specialDiscount'
    });
    expect(result.current.checkout.id).toBe('foo');
  });

  it('[applyDiscount] should create a checkout if none exists', async () => {
    const queries = createMockQueries();
    const { result } = renderHook(() => useCheckout(queries));
    await wait();
    act(() => {
      result.current.applyDiscount('specialDiscount');
    });
    await wait();
    await wait();

    if (!result.current.checkout) throw new Error('checkout was not created');
    expect(queries.checkoutCreate).toHaveBeenCalledTimes(0);
    expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledTimes(1);
    expect(queries.checkoutDiscountCodeApply).toHaveBeenCalledWith({
      checkoutId: 'foo',
      discountCode: 'specialDiscount'
    });
    expect(result.current.checkout.id).toBe('foo');
  });

  it('[removeDiscount] should remove the current discount code', async () => {
    const queries = createMockQueries();
    const { result } = renderHook(() => useCheckout(queries));
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    act(() => {
      result.current.applyDiscount('specialDiscount');
    });

    await wait();
    act(() => {
      result.current.removeDiscount();
    });
    await wait();

    if (!result.current.checkout) throw new Error('checkout was not created');
    expect(queries.checkoutDiscountCodeRemove).toHaveBeenCalledWith({
      checkoutId: 'foo'
    });
  });

  it('should return userErrors if the request returned errors', async () => {
    const queries = createMockQueries(false);
    const checkoutCreate = jest.fn().mockResolvedValue({
      data: {
        checkoutCreate: {
          checkoutUserErrors: [
            { field: 'email', message: 'That is not a valid email' }
          ]
        }
      }
    });
    const { result } = renderHook(() =>
      useCheckout({ ...queries, checkoutCreate })
    );
    await wait();
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    expect(result.current.checkoutUserErrors[0].message).toBe(
      'That is not a valid email'
    );
  });
});
