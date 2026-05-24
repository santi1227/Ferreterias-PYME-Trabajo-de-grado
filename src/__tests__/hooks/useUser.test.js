import { renderHook, waitFor } from '@testing-library/react';
import useUser from '@/app/hooks/useUser';

describe('useUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch user data on mount', async () => {
    const mockUser = {
      userName: 'testuser',
      userEmail: 'test@example.com',
      userId: '123',
    };

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => mockUser,
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current).toEqual(mockUser);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/getUserCookie');
  });

  it('should set user to null if response has no userName', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should handle 401 response and redirect to login', async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    global.fetch.mockResolvedValueOnce({
      status: 401,
      json: async () => ({}),
    });

    renderHook(() => useUser());

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
      expect(document.cookie).toContain('token=');
    });

    window.location = originalLocation;
  });

  it('should handle fetch errors and redirect to login', async () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderHook(() => useUser());

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });

    window.location = originalLocation;
  });

  it('should return initial state as null', () => {
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ userName: 'user' }),
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toBeNull();
  });

  it('should clear token cookie on 401', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 401,
      json: async () => ({}),
    });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    renderHook(() => useUser());

    await waitFor(() => {
      expect(document.cookie).toContain('Max-Age=0');
    });

    window.location = originalLocation;
  });
});
