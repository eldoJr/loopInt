import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock React for proper hook testing
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useCallback: vi.fn((fn) => fn),
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ className, ...props }: any) => 
    React.createElement('div', { className, 'data-testid': 'mock-icon', ...props })
  
  return new Proxy({}, {
    get: () => MockIcon
  })
})