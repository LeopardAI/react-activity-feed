// Mock ReactDOM.render with createRoot for React 18 compatibility
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from './src/utils/react18-compatibility';

// Ensure requestAnimationFrame is available in the test environment
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

// Ensure the act warnings are suppressed when needed
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// Replace the original methods with our compatibility versions
ReactDOM.render = render;
ReactDOM.unmountComponentAtNode = unmountComponentAtNode;
