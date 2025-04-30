import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useWeather } from '../useWeather'

// Test component to surface hook values via DOM
function WeatherComponent() {
  const { weather, loading, error } = useWeather()
  return (
    <>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="temp">{weather?.temp ?? ''}</div>
      <div data-testid="desc">{weather?.description ?? ''}</div>
      <div data-testid="city">{weather?.city ?? ''}</div>
      <div data-testid="error">{error?.message ?? ''}</div>
    </>
  )
}

describe('useWeather hook', () => {
  beforeEach(() => {
    // Ensure real timers for async fetch flow
    vi.useRealTimers()
    // Mock geolocation
    // @ts-ignore
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn((success) => {
        success({ coords: { latitude: 10, longitude: 20 } })
      }),
    }
    // Mock fetch: first call returns weather, second returns reverse-geocode
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ current: { temperature_2m: 25, weather_code: 1 } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ address: { city: 'TestCity' } }),
      })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches weather and updates state', async () => {
    const { getByTestId } = render(<WeatherComponent />)
    // initially loading
    expect(getByTestId('loading').textContent).toBe('true')
    // wait for loading to become false
    await waitFor(() => expect(getByTestId('loading').textContent).toBe('false'))
    // check values
    expect(getByTestId('temp').textContent).toBe('25')
    expect(getByTestId('desc').textContent).toBe('Mainly Clear')
    expect(getByTestId('city').textContent).toBe('TestCity')
    expect(getByTestId('error').textContent).toBe('')
  })
  it('handles fetch failure and sets fallback', async () => {
    // Mock fetch failures
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Err' })
    const { getByTestId } = render(<WeatherComponent />)
    // wait for loading false
    await waitFor(() => expect(getByTestId('loading').textContent).toBe('false'))
    // fallback values
    expect(getByTestId('temp').textContent).toBe('20')
    expect(getByTestId('desc').textContent).toBe('Clear')
    expect(getByTestId('city').textContent).toBe('Unknown')
    expect(getByTestId('error').textContent).toMatch(/Weather API error/)  
  })
})