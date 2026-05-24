import '@testing-library/jest-dom'

// Mock Request and NextResponse for API tests
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url
    this.method = options.method || 'GET'
    this.body = options.body
    this._bodyUsed = false
  }

  async json() {
    if (this._bodyUsed) {
      throw new Error('body already read')
    }
    this._bodyUsed = true
    return JSON.parse(this.body)
  }

  async text() {
    if (this._bodyUsed) {
      throw new Error('body already read')
    }
    this._bodyUsed = true
    return this.body
  }

  clone() {
    return new Request(this.url, {
      method: this.method,
      body: this.body,
    })
  }
}

global.NextResponse = {
  json: (data, init = {}) => ({
    json: async () => data,
    status: init.status || 200,
    headers: init.headers || {},
    cookies: {
      set: jest.fn(),
    },
  }),
  error: (error, init = {}) => ({
    json: async () => ({ error }),
    status: init.status || 500,
  }),
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}

