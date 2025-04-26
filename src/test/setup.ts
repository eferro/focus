import '@testing-library/jest-dom/vitest';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock browser APIs that are not available in JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock browser APIs
global.ResizeObserver = ResizeObserverMock;
global.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  // Reset mocks
  vi.clearAllMocks();
}); 