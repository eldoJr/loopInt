import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  it('initializes with empty state', () => {
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('logs in user successfully', () => {
    const testUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    }

    useAuthStore.getState().login(testUser)
    
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toEqual(testUser)
    expect(isAuthenticated).toBe(true)
  })

  it('logs out user successfully', () => {
    const testUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    }

    // First login
    useAuthStore.getState().login(testUser)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    // Then logout
    useAuthStore.getState().logout()
    
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })
})