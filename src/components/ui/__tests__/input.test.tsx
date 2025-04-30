import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input component', () => {
  it('renders an input with default type text', () => {
    const { getByRole } = render(<Input />)
    const input = getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    // default input type should be 'text'
    expect(input.type).toBe('text')
  })

  it('accepts custom type and placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input type="email" placeholder="Enter email" />
    )
    const input = getByPlaceholderText('Enter email') as HTMLInputElement
    expect(input.placeholder).toBe('Enter email')
    expect(input.type).toBe('email')
  })

  it('applies disabled attribute and styling when disabled', () => {
    const { getByRole } = render(<Input disabled placeholder="Foo" />)
    const input = getByRole('textbox')
    expect(input).toBeDisabled()
    const cls = input.className
    expect(cls).toContain('disabled:cursor-not-allowed')
    expect(cls).toContain('disabled:opacity-50')
  })

  it('merges custom className with default styles', () => {
    const { getByRole } = render(
      <Input className="custom-class" placeholder="hello" />
    )
    const input = getByRole('textbox')
    expect(input.className).toContain('custom-class')
    // default utility class should be present
    expect(input.className).toContain('rounded-md')
  })

  it('updates value on user input', async () => {
    const { getByRole } = render(<Input placeholder="Type here" />)
    const input = getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'Hello')
    expect(input.value).toBe('Hello')
  })
})