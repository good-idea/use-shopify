import { act, renderHook } from 'react-hooks-testing-library';
import { wait } from 'react-testing-library';
import { useCheckout } from '../useCheckout';
import { dummyProduct } from './stubs';
import 'jest-fetch-mock';

jest.useFakeTimers();

describe('useCheckout', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const dummyVariant = dummyProduct.variants.edges[0].node;
  const dummyLineItem = {
    id: dummyProduct.id,
    quantity: 1,
    title: dummyProduct.title,
    variant: dummyVariant
  };
  const dummyLineItemAdd = { variantId: dummyVariant.id, quantity: 1 };

  it('[addToCheckout] should create a new checkout if none exists', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: { checkoutCreate: { currentCheckout: { id: 'foo' } } }
      })
    );
    const { result } = renderHook(() => useCheckout());
    const { currentCheckout, addToCheckout } = result.current;

    expect(currentCheckout).toBe(undefined);
    act(() => {
      addToCheckout({ lineItems: [dummyLineItemAdd] });
    });

    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');

    expect(result.current.currentCheckout.id).toBe('foo');
  });

  it('[addToCheckout] should add new items to the current checkout', async () => {
    // Really just testing that it looks for `checkoutCreate` or `checkoutLineItemsAdd` properly
    fetchMock
      .once(
        JSON.stringify({
          data: {
            checkoutCreate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutLineItemsAdd: {
              currentCheckout: {
                id: 'foo',
                lineItems: [
                  {
                    ...dummyLineItem,
                    quantity: 2
                  }
                ]
              }
            }
          }
        })
      );
    const { result } = renderHook(() => useCheckout());

    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.lineItems[0].quantity).toBe(2);
  });

  it('[addItemToCheckout] should add a single item to the current checkout', async () => {
    fetchMock.once(
      JSON.stringify({
        data: {
          checkoutCreate: {
            currentCheckout: {
              id: 'foo',
              lineItems: [{ ...dummyLineItem, quantity: 3 }]
            }
          }
        }
      })
    );
    const { result } = renderHook(() => useCheckout());

    act(() => {
      result.current.addItemToCheckout({ ...dummyLineItemAdd, quantity: 3 });
    });
    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.lineItems[0].quantity).toBe(3);
  });

  it('[updateQuantity] should update the quantity of a given variant', async () => {
    fetchMock
      .once(
        JSON.stringify({
          data: {
            checkoutCreate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutLineItemsUpdate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [
                  {
                    ...dummyLineItem,
                    quantity: 100
                  }
                ]
              }
            }
          }
        })
      );
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    act(() => {
      result.current.updateQuantity(dummyLineItem, 100);
    });
    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.lineItems[0].quantity).toBe(100);
  });

  it('[applyDiscount] should create a checkout if none exists', async () => {
    fetchMock
      .once(
        JSON.stringify({
          data: {
            checkoutCreate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutDiscountCodeApplyV2: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem],
                discountApplications: [
                  {
                    allocationMethod: 'EACH',
                    targeSelection: 'ALL',
                    targetType: 'LINE_ITEM',
                    value: {
                      amount: 1000,
                      currencyCode: 'USD'
                    },
                    code: 'specialDiscount'
                  }
                ]
              }
            }
          }
        })
      );
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.applyDiscount('specialDiscount');
    });
    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.id).toBe('foo');
  });

  it('[applyDiscount] should apply a discount code', async () => {
    fetchMock
      .once(
        JSON.stringify({
          data: {
            checkoutCreate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutDiscountCodeApplyV2: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem],
                discountApplications: [
                  {
                    allocationMethod: 'EACH',
                    targeSelection: 'ALL',
                    targetType: 'LINE_ITEM',
                    value: {
                      amount: 1000,
                      currencyCode: 'USD'
                    },
                    code: 'specialDiscount'
                  }
                ]
              }
            }
          }
        })
      );
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    act(() => {
      result.current.applyDiscount('specialDiscount');
    });

    await wait();
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.discountApplications[0].code).toBe(
      'specialDiscount'
    );
  });

  it('[removeDiscount] should remove the current discount code', async () => {
    fetchMock
      .once(
        JSON.stringify({
          data: {
            checkoutCreate: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutDiscountCodeApplyV2: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem],
                discountApplications: [
                  {
                    allocationMethod: 'EACH',
                    targeSelection: 'ALL',
                    targetType: 'LINE_ITEM',
                    value: {
                      amount: 1000,
                      currencyCode: 'USD'
                    },
                    code: 'specialDiscount'
                  }
                ]
              }
            }
          }
        })
      )
      .once(
        JSON.stringify({
          data: {
            checkoutDiscountCodeRemove: {
              currentCheckout: {
                id: 'foo',
                lineItems: [dummyLineItem]
              }
            }
          }
        })
      );

    const { result } = renderHook(() => useCheckout());
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
    if (!result.current.currentCheckout)
      throw new Error('checkout was not created');
    expect(result.current.currentCheckout.discountApplications).toBe(undefined);
  });

  it('should return userErrors if the request returned errors', async () => {
    fetchMock.once(
      JSON.stringify({
        data: {
          checkoutCreate: {
            userErrors: [
              { field: 'email', message: 'That is not a valid email' }
            ]
          }
        }
      })
    );
    const { result } = renderHook(() => useCheckout());
    act(() => {
      result.current.addToCheckout({ lineItems: [dummyLineItemAdd] });
    });
    await wait();
    expect(result.current.userErrors[0].message).toBe(
      'That is not a valid email'
    );
  });
});
