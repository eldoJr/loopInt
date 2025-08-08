import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Simple wrapper without problematic providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }