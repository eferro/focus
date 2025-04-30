import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from '../button'

describe('Button component', () => {
  it('renders as a <button> by default and displays children text', () => {
    const { getByRole } = render(<Button>Click me</Button>)
    const btn = getByRole('button', { name: /click me/i })
    expect(btn.tagName).toBe('BUTTON')
  })

  it('applies disabled attribute and styling when disabled', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>)
    const btn = getByRole('button', { name: /disabled/i })
    expect(btn).toBeDisabled()
    // disabled styles applied via Tailwind variant prefix
    const cls = btn.className
    expect(cls).toContain('disabled:opacity-50')
    expect(cls).toContain('disabled:pointer-events-none')
  })

  it('applies variant and size classes correctly', () => {
    const { getByRole } = render(
      <Button variant="destructive" size="sm">Small Destructive</Button>
    )
    const btn = getByRole('button', { name: /small destructive/i })
    expect(btn.className).toMatch(/bg-destructive/)
    expect(btn.className).toMatch(/h-9/)  // sm size => h-9
  })

  it('renders custom child element when asChild is true', () => {
    const { getByRole } = render(
      <Button asChild variant="link">
        <a href="/test">Link</a>
      </Button>
    )
    const link = getByRole('link', { name: /link/i })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
    // link variant should include underline class
    expect(link.className).toMatch(/underline-offset-4/)  
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(<Button onClick={handleClick}>Press</Button>)
    const btn = getByRole('button', { name: /press/i })
    await userEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})