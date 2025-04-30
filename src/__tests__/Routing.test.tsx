import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'

// Stub FocusApp to avoid full render
vi.mock('@/components/FocusApp', () => ({
  __esModule: true,
  default: () => <div data-testid="focus-app">FocusApp</div>,
}))

describe('Pages and routing', () => {
  it('Index route renders FocusApp within correct container', () => {
    const { getByTestId, container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    )
    // FocusApp stub should be present
    expect(getByTestId('focus-app')).toBeInTheDocument()
    // container div should have full-screen classes
    const wrapper = container.firstChild as Element
    expect(wrapper).toHaveClass('h-screen')
    expect(wrapper).toHaveClass('w-screen')
    expect(wrapper).toHaveClass('overflow-hidden')
  })

  it('Unknown route renders NotFound and logs console error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const path = '/non-existing'
    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    )
    // Check 404 UI
    expect(getByText('404')).toBeInTheDocument()
    expect(getByText('Oops! Page not found')).toBeInTheDocument()
    const link = getByRole('link', { name: /return to home/i })
    expect(link.getAttribute('href')).toBe('/')
    // ensure console.error was called with path
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('404 Error: User attempted to access non-existent route:'),
      path
    )
    consoleError.mockRestore()
  })
})