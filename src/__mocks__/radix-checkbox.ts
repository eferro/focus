import React from 'react'

// Simplified stub of Radix Checkbox primitives
export const Root = React.forwardRef(
  ({ checked, onCheckedChange, disabled, children, ...props }: any, ref) => (
    <input
      type="checkbox"
      role="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
      ref={ref}
      {...props}
    />
  ),
)

export const Indicator = ({ children, ...props }: any) => (
  <span {...props}>{children}</span>
)