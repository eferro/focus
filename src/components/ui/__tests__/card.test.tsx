import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card'

describe('Card UI primitives', () => {
  it('renders Card as a div and merges className', () => {
    render(<Card className="test-card">Hello</Card>)
    const el = screen.getByText('Hello')
    // The element itself should have the card classes
    expect(el).toHaveClass('rounded-lg')
    expect(el).toHaveClass('test-card')
  })

  it('renders CardHeader with custom class and children', () => {
    render(<CardHeader className="hdr">Header</CardHeader>)
    const hdr = screen.getByText('Header')
    expect(hdr).toBeInTheDocument()
    // Header element itself has the padding and custom class
    expect(hdr).toHaveClass('p-6')
    expect(hdr).toHaveClass('hdr')
  })

  it('renders CardTitle as h3 with default styles', () => {
    render(<CardTitle className="ttl">Title</CardTitle>)
    const ttl = screen.getByText('Title')
    expect(ttl.tagName).toBe('H3')
    expect(ttl).toHaveClass('text-2xl')
    expect(ttl).toHaveClass('ttl')
  })

  it('renders CardDescription as p with muted text', () => {
    render(<CardDescription>Description</CardDescription>)
    const desc = screen.getByText('Description')
    expect(desc.tagName).toBe('P')
    expect(desc).toHaveClass('text-muted-foreground')
  })

  it('renders CardContent wrapping children', () => {
    render(
      <CardContent className="content">Content</CardContent>
    )
    const cont = screen.getByText('Content')
    expect(cont).toHaveClass('p-6')
    expect(cont).toHaveClass('content')
  })

  it('renders CardFooter and merges classes', () => {
    render(
      <CardFooter className="ftr">Footer</CardFooter>
    )
    const ftr = screen.getByText('Footer')
    expect(ftr).toHaveClass('items-center')
    expect(ftr).toHaveClass('ftr')
  })
})