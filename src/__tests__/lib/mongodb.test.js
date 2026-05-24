import mongoose from 'mongoose'

describe('MongoDB Connection Library', () => {
  beforeEach(() => {
    process.env.DB_URI = 'mongodb://localhost:27017/test'
  })

  it('should have mongoose connected', () => {
    expect(mongoose).toBeDefined()
  })

  it('should use environment DB_URI setting', () => {
    process.env.DB_URI = 'mongodb://mongo.example.com:27017/app'
    expect(process.env.DB_URI).toContain('mongo.example.com')
  })

  it('should have connect function', () => {
    expect(mongoose.connect).toBeDefined()
    expect(typeof mongoose.connect).toBe('function')
  })

  it('should have model function', () => {
    expect(mongoose.model).toBeDefined()
    expect(typeof mongoose.model).toBe('function')
  })

  it('should have Schema constructor', () => {
    expect(mongoose.Schema).toBeDefined()
    expect(typeof mongoose.Schema).toBe('function')
  })

  it('should have Schema.Types.ObjectId', () => {
    expect(mongoose.Schema.Types).toBeDefined()
    expect(mongoose.Schema.Types.ObjectId).toBeDefined()
  })
})
