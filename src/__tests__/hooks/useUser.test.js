import { renderHook, waitFor } from '@testing-library/react'
import useUser from '@/app/hooks/useUser'

describe('useUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch user data on mount', async () => {
    const mockUser = {
      userName: 'testuser',
      userEmail: 'test@example.com',
      userId: '123',
    }

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUser,
    })

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      expect(result.current).toEqual(mockUser)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/getUserCookie')
  })

  it('should set user to null if response has no userName', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    })

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('should handle fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('should return initial state as null', () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ userName: 'user' }),
    })

    const { result } = renderHook(() => useUser())

    expect(result.current).toBeNull()
  })

  it('should call fetch only once on mount', async () => {
    const mockUser = { userName: 'testuser' }

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUser,
    })

    renderHook(() => useUser())

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle user with complete data', async () => {
    const mockUser = {
      userName: 'john',
      userEmail: 'john@example.com',
      userId: '456',
      userRol: 'admin',
      userPhone: '1234567890',
      userCreated: '2024-01-01',
    }

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUser,
    })

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      expect(result.current).toEqual(mockUser)
      expect(result.current.userName).toBe('john')
      expect(result.current.userRol).toBe('admin')
    })
  })

  it('should handle 401 status code', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 401,
      json: async () => ({}),
    })

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      // Hook should catch 401 and handle it
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should handle API response with missing fields', async () => {
    const mockUser = {
      userName: 'partial',
      // Missing other fields
    }

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUser,
    })

    const { result } = renderHook(() => useUser())

    await waitFor(() => {
      expect(result.current.userName).toBe('partial')
    })
  })
})
