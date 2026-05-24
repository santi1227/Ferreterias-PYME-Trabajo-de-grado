import '@testing-library/jest-dom'

// Mock Response for Next.js API routes
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.headers = init.headers || {}
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }

  async text() {
    return this.body
  }
}

// Mock Request for Next.js API routes
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

// Mock NextResponse
global.NextResponse = {
  json: (data, init = {}) => ({
    json: async () => data,
    status: init.status || 200,
    headers: init.headers || {},
    cookies: {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    },
  }),
  error: (error, init = {}) => ({
    json: async () => ({ error }),
    status: init.status || 500,
  }),
  redirect: (url) => ({
    status: 307,
    headers: { Location: url },
  }),
}

// Mock Mongoose and related libraries
jest.mock('mongoose', () => {
  const mockModel = jest.fn()
  mockModel.findOne = jest.fn()
  mockModel.find = jest.fn()
  mockModel.findById = jest.fn()
  mockModel.findByIdAndUpdate = jest.fn()
  mockModel.findByIdAndDelete = jest.fn()
  mockModel.create = jest.fn()
  mockModel.countDocuments = jest.fn()
  mockModel.save = jest.fn()

  const SchemaConstructor = jest.fn((schema) => schema)
  SchemaConstructor.Types = {
    ObjectId: jest.fn(),
    String: String,
    Number: Number,
    Date: Date,
    Boolean: Boolean,
    Array: Array,
  }

  return {
    Schema: SchemaConstructor,
    model: jest.fn(() => mockModel),
    connect: jest.fn().mockResolvedValue({}),
    disconnect: jest.fn().mockResolvedValue({}),
    models: {},
    connection: {
      getClient: jest.fn(),
    },
  }
})

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

// Suppress Not Implemented errors from JSDOM
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Not implemented') ||
        args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('navigation'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})



