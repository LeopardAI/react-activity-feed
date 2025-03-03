import { ReactElement } from 'react';
import { render as rtlRender, RenderOptions, RenderResult, act } from '@testing-library/react';

/**
 * Custom render function that wraps react-testing-library's render with act
 * to fix React 18 warnings about using act properly
 */
export function render(ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult {
  let result: RenderResult = {} as RenderResult;

  act(() => {
    result = rtlRender(ui, options);
  });

  return result;
}

// Re-export everything else from react-testing-library
export * from '@testing-library/react';
// Export act for testing scenarios
export { act };
