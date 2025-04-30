import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('concatenates simple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('drops falsy values and merges arrays', () => {
    const arr = ['one', null, undefined, ['two', false, ['three']]]
    expect(cn('zero', ...arr, '')).toBe('zero one two three')
  })

  it('merges Tailwind classes, with later classes winning', () => {
    // p-2 then p-4: p-4 should override
    const result = cn('p-2 p-4', 'p-1', 'px-3')
    expect(result).toContain('p-1')
    expect(result).toContain('px-3')
    expect(result).not.toContain('p-2')
    expect(result).not.toContain('p-4')
  })

  it('handles conditional objects via clsx', () => {
    const result = cn({ foo: true, bar: false }, 'baz')
    expect(result).toBe('foo baz')
  })
})