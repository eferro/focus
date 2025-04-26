import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Add any providers here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    // Configure userEvent with no delay to avoid async act warnings
    user: userEvent.setup({ delay: 0 }),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 