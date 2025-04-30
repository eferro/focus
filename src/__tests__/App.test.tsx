import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock UI providers and components
vi.mock('@/components/ui/toaster', () => ({
  __esModule: true,
  Toaster: () => <div data-testid="toaster-ui" />,
}))
vi.mock('@/components/ui/sonner', () => ({
  __esModule: true,
  Toaster: () => <div data-testid="sonner-ui" />,
}))
vi.mock('@/components/ui/tooltip', () => ({
  __esModule: true,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
}))
// Stub Index page (which wraps FocusApp)
vi.mock('@/pages/Index', () => ({
  __esModule: true,
  default: () => <div data-testid="focus-app" />,
}))

// Ensure consistent hash history
function setHash(path = '/') {
  window.location.hash = `#${path}`
}

import App from '../App'

describe('App integration', () => {
  beforeEach(() => {
    // Reset hash
    setHash('/')
  })

  it('renders providers and default Index route', () => {
    setHash('/')
    render(<App />)
    // Providers
    expect(screen.getByTestId('toaster-ui')).toBeInTheDocument()
    expect(screen.getByTestId('sonner-ui')).toBeInTheDocument()
    // Index route should render FocusApp
    expect(screen.getByTestId('focus-app')).toBeInTheDocument()
  })

  it('renders NotFound on unknown hash route', () => {
    setHash('/unknown')
    render(<App />)
    // NotFound shows 404 text
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument()
  })
})