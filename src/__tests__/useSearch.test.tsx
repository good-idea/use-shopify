import { renderHook } from '@testing-library/react-hooks'
import { wait, act } from '@testing-library/react'
import { useSearch } from '../useSearch'
import { SEARCH_QUERY as defaultSearchQuery } from '../useSearch/searchQuery'

beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  // @ts-ignore
  if (console.error.mockRestore) console.error.mockRestore()
})

const dummyResult = {
  products: {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [{ title: 'diamond ring' }],
  },
  collections: {
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
    },
    edges: [{ title: 'diamond collection' }],
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

  it('should assign search results to the state', async () => {
    const query = jest.fn().mockResolvedValue({ data: dummyResult })
    const { result } = renderHook(() => useSearch({ query }))
    const { search } = result.current
    expect(result.current.loading).toBe(false)

    act(() => {
      search('diamond ring')
    })

    expect(result.current.loading).toBe(true)
    await wait() // Wait for the query result to finish
    expect(result.current.loading).toBe(false)
    expect(result.current.results).toEqual(dummyResult)
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

  it.skip('should only search products or collections when either are marked as `false` in the config', async () => {
    // expect(a).toBe(b)
  })

  it.skip('should search with the page size supplied from the config', async () => {
    // expect(a).toBe(b)
  })
})
