/* eslint-disable no-console */
import { renderHook } from '@testing-library/react-hooks'
import { wait as rtlWait, act } from '@testing-library/react'
import { useSearch } from '../useSearch'
import { SEARCH_QUERY as defaultSearchQuery } from '../useSearch/searchQuery'

beforeAll(() => {
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  // @ts-ignore
  if (console.warn.mockRestore) console.error.mockRestore()
  // @ts-ignore
  if (console.error.mockRestore) console.error.mockRestore()
})

jest.useFakeTimers()

const wait = async () => {
  jest.runAllTimers()
  await rtlWait()
}

const dummyResult = {
  products: {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [{ cursor: 'abc', node: { title: 'diamond ring' } }],
  },
  collections: {
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
    },
    edges: [{ cursor: 'def', node: { title: 'diamond collection' } }],
  },
}

const dummyResultTwo = {
  products: {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [{ cursor: '123', node: { title: 'diamond ring 2' } }],
  },
  collections: {
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
    },
    edges: [{ cursor: '234', node: { title: 'diamond collection 2' } }],
  },
}

describe('useSearch', () => {
  it('should use the default query', async () => {
    const query = jest.fn().mockResolvedValue({ data: '' })
    const { result } = renderHook(() => useSearch({ query }))
    const { search } = result.current
    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls[0][0]).toBe(defaultSearchQuery)
  })

  it('should use a custom query', async () => {
    const customQueries = {
      SEARCH_QUERY: 'ABC',
    }
    const query = jest.fn().mockResolvedValue({ data: '' })
    const { result } = renderHook(() =>
      useSearch({ query, queries: customQueries }),
    )
    const { search } = result.current
    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls[0][0]).toBe(customQueries.SEARCH_QUERY)
  })

  it('should store the results in the state', async () => {
    /**
     * All search results should be parsed into a simple list of products
     * and collections,
     * and each 'raw' paginated search result should be added to the
     * 'results' array
     */
    const query = jest
      .fn()
      .mockResolvedValueOnce({ data: dummyResult })
      .mockResolvedValueOnce({ data: dummyResultTwo })
    const { result } = renderHook(() => useSearch({ query }))
    const { search } = result.current
    expect(result.current.loading).toBe(false)

    act(() => {
      search('diamond ring')
    })

    expect(result.current.loading).toBe(true)
    await wait() // Wait for the query result to finish
    expect(result.current.loading).toBe(false)
    expect(result.current.products[0].title).toBe(
      dummyResult.products.edges[0].node.title,
    )

    expect(result.current.collections[0].title).toBe(
      dummyResult.collections.edges[0].node.title,
    )
    expect(result.current.results[0]).toEqual(dummyResult)

    //TODO: Test loadMore here
  })

  it('should memoize search term results', async () => {
    const query = jest.fn().mockResolvedValue({ data: ':)' })
    const { result } = renderHook(() => useSearch({ query }))
    const { search } = result.current

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(1)

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(1)

    act(() => {
      search('gold ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(2)

    act(() => {
      search('gold ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(2)

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(2)
  })

  it('should not memoize search term results when config.memoize is false', async () => {
    const query = jest.fn().mockResolvedValue({ data: ':)' })
    const config = {
      memoize: false,
    }
    const { result } = renderHook(() => useSearch({ query, config }))
    const { search } = result.current

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(1)

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(2)

    act(() => {
      search('gold ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(3)

    act(() => {
      search('gold ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(4)

    act(() => {
      search('diamond ring')
    })
    await wait()
    expect(query.mock.calls.length).toBe(5)
  })

  it('should debounce calls to `search`', async () => {
    const query = jest.fn().mockResolvedValue({ data: ':)' })
    const { result } = renderHook(() => useSearch({ query }))
    const { search } = result.current

    expect(result.current.loading).toBe(false)
    act(() => search('d'))
    expect(result.current.loading).toBe(true)
    jest.advanceTimersByTime(20)
    act(() => search('di'))
    jest.advanceTimersByTime(20)
    act(() => search('dia'))
    jest.advanceTimersByTime(20)
    act(() => search('diam'))
    jest.advanceTimersByTime(20)
    act(() => search('diamo'))
    jest.advanceTimersByTime(20)
    act(() => search('diamon'))
    jest.advanceTimersByTime(20)
    act(() => search('diamond'))
    jest.advanceTimersByTime(20)
    expect(query.mock.calls.length).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(query.mock.calls.length).toBe(1)
  })

  it('should debounce by the time assigned to config.debounce', async () => {
    const query = jest.fn().mockResolvedValue({ data: ':)' })
    const config = {
      debounce: 30,
    }
    const { result } = renderHook(() => useSearch({ query, config }))
    const { search } = result.current

    expect(result.current.loading).toBe(false)
    act(() => search('d'))
    expect(result.current.loading).toBe(true)
    jest.advanceTimersByTime(20)
    act(() => search('di'))
    jest.advanceTimersByTime(20)
    act(() => search('dia'))
    jest.advanceTimersByTime(40) // should fire once here
    act(() => search('diam'))
    jest.advanceTimersByTime(20)
    act(() => search('diamo'))
    jest.advanceTimersByTime(20)
    act(() => search('diamon'))
    jest.advanceTimersByTime(20)
    act(() => search('diamond'))
    jest.advanceTimersByTime(40) // and again here
    expect(query.mock.calls.length).toBe(2)
    jest.advanceTimersByTime(1000)
    expect(query.mock.calls.length).toBe(2)
  })

  it('should not debounce when config.debounce === 0', async () => {
    const query = jest.fn().mockResolvedValue({ data: ':)' })
    const config = {
      debounce: 0,
    }
    const { result } = renderHook(() => useSearch({ query, config }))
    const { search } = result.current

    expect(result.current.loading).toBe(false)
    act(() => search('d'))
    expect(result.current.loading).toBe(true)
    jest.advanceTimersByTime(20)
    act(() => search('di'))
    jest.advanceTimersByTime(20)
    act(() => search('dia'))
    jest.advanceTimersByTime(20) // should fire once here
    act(() => search('diam'))
    jest.advanceTimersByTime(20)
    act(() => search('diamo'))
    jest.advanceTimersByTime(20)
    act(() => search('diamon'))
    jest.advanceTimersByTime(20)
    act(() => search('diamond'))
    jest.advanceTimersByTime(20) // and again here
    expect(query.mock.calls.length).toBe(7)
    jest.advanceTimersByTime(1000)
    expect(query.mock.calls.length).toBe(7)
  })

  it.skip('should only search products or collections when either are marked as `false` in the config', async () => {
    // expect(a).toBe(b)
  })

  it.skip('should search with the page size supplied from the config', async () => {
    // expect(a).toBe(b)
  })

  it("should search with the state's `searchTerm` by default", async () => {
    const query = jest.fn().mockResolvedValue({ data: '' })
    const { result } = renderHook(() => useSearch({ query }))
    result.current.setSearchTerm('lolwut')
    result.current.search()
    await wait()
    expect(query.mock.calls[0][1].productQuery).toBe('lolwut')
    expect(result.current.searchTerm).toBe('lolwut')
  })

  it("should ignore the state's `searchTerm` when given its own searchTerm argument", async () => {
    const query = jest.fn().mockResolvedValue({ data: '' })
    const { result } = renderHook(() => useSearch({ query }))
    const { search, setSearchTerm } = result.current
    setSearchTerm('lol wut')
    await wait()
    search('hello')
    await wait()
    expect(query.mock.calls[0][1].productQuery).toBe('hello')
    expect(result.current.searchTerm).toBe('hello')
  })
})

describe('useSearch [setSearchTerm]', () => {
  it('should update the current search term', async () => {
    const query = jest.fn().mockResolvedValue({ data: '' })
    const { result } = renderHook(() => useSearch({ query }))
    const { setSearchTerm } = result.current
    expect(result.current.searchTerm).toBe('')
    setSearchTerm('hello')
    await wait()
    expect(result.current.searchTerm).toBe('hello')
  })
})
