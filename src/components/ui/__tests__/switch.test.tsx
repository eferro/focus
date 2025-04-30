import React from 'react'
import { vi } from 'vitest'
// Stub Radix Switch primitives
vi.mock('@radix-ui/react-switch', () => ({
  __esModule: true,
  Root: React.forwardRef(({ children, checked, onCheckedChange, disabled, ...props }: any, ref) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
      ref={ref}
      {...props}
    />
  )),
  Thumb: ({ ...props }: any) => <div {...props} />,
}))
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../switch'
import { vi } from 'vitest'

describe('Switch component', () => {
  it('renders unchecked by default and has role switch', () => {
    render(<Switch />)
    const sw = screen.getByRole('switch') as HTMLInputElement
    expect(sw).toBeInTheDocument()
    expect(sw.checked).toBe(false)
  })

  it('toggles checked state on click and calls onCheckedChange', async () => {
    const handle = vi.fn()
    render(<Switch onCheckedChange={handle} />)
    const sw = screen.getByRole('switch') as HTMLInputElement
    await userEvent.click(sw)
    expect(handle).toHaveBeenCalledWith(true)
    expect(sw.checked).toBe(true)
    await userEvent.click(sw)
    expect(handle).toHaveBeenCalledWith(false)
    expect(sw.checked).toBe(false)
  })

  it('applies disabled attribute and styling when disabled', () => {
    render(<Switch disabled className="custom-cls" />)
    const sw = screen.getByRole('switch')
    expect(sw).toBeDisabled()
    expect(sw.className).toContain('disabled:opacity-50')
    expect(sw.className).toContain('custom-cls')
  })
})