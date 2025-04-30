import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useIsMobile } from '../use-mobile'

// Mobile breakpoint is 768px
const QUERY = '(max-width: 767px)'

// Shared MediaQueryList stub
let mql: any

describe('useIsMobile hook', () => {
  beforeEach(() => {
    // Simulate MediaQueryList with listeners
    mql = {
      media: QUERY,
      matches: false,
      listeners: [] as Array<() => void>,
      addEventListener: (_: string, cb: () => void) => {
        mql.listeners.push(cb)
      },
      removeEventListener: (_: string, cb: () => void) => {
        mql.listeners = mql.listeners.filter((fn) => fn !== cb)
      }
    }
    // Spy matchMedia to return our stub
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      mql.media = query
      mql.matches = window.innerWidth < 768
      return mql
    })
  })

  it('returns true when width is below breakpoint', () => {
    window.innerWidth = 500
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('returns false when width is above breakpoint', () => {
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('updates when window size changes', () => {
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
    // simulate resize below breakpoint and notify listeners
    act(() => {
      window.innerWidth = 400
      // update matches and fire listeners
      mql.matches = true
      mql.listeners.forEach((cb) => cb())
    })
    expect(result.current).toBe(true)
  })
})