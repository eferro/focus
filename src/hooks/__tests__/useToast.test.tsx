import React from 'react'
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'

let useToast: any
let toastFn: any
let state: any

function Listener() {
  state = useToast()
  return null
}

describe('useToast hook', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../use-toast')
    useToast = mod.useToast
    toastFn = mod.toast
    state = null
  })

  it('starts with no toasts', () => {
    const { unmount } = render(<Listener />)
    expect(state.toasts).toHaveLength(0)
    unmount()
  })

  it('adds a toast when toast() is called', () => {
    render(<Listener />)
    act(() => {
      toastFn({ title: 'A', description: 'B' })
    })
    expect(state.toasts.length).toBe(1)
    const t = state.toasts[0]
    expect(t.title).toBe('A')
    expect(t.description).toBe('B')
    expect(t.open).toBe(true)
  })

  it('dismisses a toast', () => {
    render(<Listener />)
    let id: string
    act(() => {
      const res = toastFn({ title: 'X' })
      id = res.id
    })
    act(() => {
      state.dismiss(id)
    })
    const t = state.toasts.find((t: any) => t.id === id)
    expect(t.open).toBe(false)
  })
})