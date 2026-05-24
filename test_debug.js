import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'

process.env.DB_URI = 'mongodb://localhost:27017/test'

console.log('mongoose.connect:', mongoose.connect)
console.log('mongoose.connect is mock:', typeof mongoose.connect.mock)

delete global.mongoose
const result1 = await connectDB()
console.log('First call result:', result1)
console.log('mongoose.connect call count:', mongoose.connect.mock.calls.length)

delete global.mongoose
mongoose.connect.mockClear()
mongoose.connect.mockResolvedValue({})
const result2 = await connectDB()
console.log('Second call result:', result2)
console.log('mongoose.connect call count:', mongoose.connect.mock.calls.length)
