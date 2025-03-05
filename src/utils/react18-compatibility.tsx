import React from 'react';
// For compatibility with both React 17 and 18
import * as ReactDOMModule from 'react-dom';
// @ts-ignore - Ignore the missing declaration file for react-dom/client
import { createRoot } from 'react-dom/client';

// Store a map of containers to roots to support multiple renders to the same container
const containerToRootMap = new Map();

// Check if createRoot is available (React 18+)
const hasCreateRoot = typeof createRoot === 'function';

// A compatibility wrapper for ReactDOM.render that uses createRoot in React 18
export function render(element: React.ReactNode, container: Element | DocumentFragment, callback?: () => void): void {
  if (hasCreateRoot) {
    // React 18 approach
    if (!containerToRootMap.has(container)) {
      const root = createRoot(container);
      containerToRootMap.set(container, root);
    }

    const root = containerToRootMap.get(container);
    root.render(element);

    // Call the callback if provided
    if (typeof callback === 'function') {
      callback();
    }
  } else {
    // React 17 approach (fallback)
    // @ts-ignore - ReactDOM.render accepts ReactNode in practice
    ReactDOMModule.render(element, container, callback);
  }
}

// A compatibility wrapper for ReactDOM.unmountComponentAtNode
export function unmountComponentAtNode(container: Element): boolean {
  if (hasCreateRoot) {
    // React 18 approach
    if (containerToRootMap.has(container)) {
      const root = containerToRootMap.get(container);
      root.unmount();
      containerToRootMap.delete(container);
      return true;
    }
    return false;
  } else {
    // React 17 approach (fallback)
    return ReactDOMModule.unmountComponentAtNode(container);
  }
}

// Export a createRoot function that ensures consistent behavior
export function getRoot(container: Element): { render: (element: React.ReactNode) => void; unmount: () => void } {
  if (hasCreateRoot) {
    if (!containerToRootMap.has(container)) {
      const root = createRoot(container);
      containerToRootMap.set(container, root);
    }
    return containerToRootMap.get(container);
  } else {
    // A simple compatibility layer for React 17
    return {
      render: (element: React.ReactNode) => {
        // @ts-ignore - ReactDOM.render accepts ReactNode in practice
        ReactDOMModule.render(element, container);
      },
      unmount: () => ReactDOMModule.unmountComponentAtNode(container),
    };
  }
}
