import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Element.prototype.scrollIntoView = vi.fn();
