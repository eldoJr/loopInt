import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useErrorHandler } from '../useErrorHandler'

// Mock the toast
vi.mock('../../components/ui/Toast', () => ({
  showToast: {
    error: vi.fn(),
  },
}))

describe('useErrorHandler', () => {
  it('handles errors with default options', () => {
    const { result } = renderHook(() => useErrorHandler())
    const error = new Error('Test error')
    
    const message = result.current.handleError(error)
    
    expect(message).toBe('Test error')
  })

  it('handles async errors successfully', async () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const successFn = vi.fn().mockResolvedValue('success')
    const response = await result.current.handleAsyncError(successFn)
    
    expect(response).toBe('success')
    expect(successFn).toHaveBeenCalled()
  })

  it('handles async errors with failure', async () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const failFn = vi.fn().mockRejectedValue(new Error('Async error'))
    const response = await result.current.handleAsyncError(failFn)
    
    expect(response).toBeNull()
    expect(failFn).toHaveBeenCalled()
  })
})