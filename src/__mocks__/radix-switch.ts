import React from 'react'

// Simplified stub of Radix Switch primitives
export const Root = React.forwardRef(
  (
    { checked, onCheckedChange, disabled, children, ...props }: any,
    ref
  ) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
      ref={ref}
      {...props}
    />
  )
)

export const Thumb = (props: any) => <div {...props} />