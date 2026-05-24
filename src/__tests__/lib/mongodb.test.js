import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  models: {},
}));

describe('MongoDB Connection Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.mongoose = undefined;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up global.mongoose cache on first call', async () => {
    const mockConnection = { connection: 'mock' };
    mongoose.connect.mockResolvedValueOnce(mockConnection);
    process.env.DB_URI = 'mongodb://localhost:27017/test';

    const result = await connectDB();

    expect(global.mongoose).toBeDefined();
    expect(global.mongoose.conn).toBeDefined();
  });

  it('should return cached connection on subsequent calls', async () => {
    const mockConnection = { connection: 'mock' };
    mongoose.connect.mockResolvedValueOnce(mockConnection);
    process.env.DB_URI = 'mongodb://localhost:27017/test';

    const result1 = await connectDB();
    const result2 = await connectDB();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should use DB_URI from environment variable', async () => {
    const mockConnection = { connection: 'mock' };
    const dbUri = 'mongodb://mongo:27017/ferreteria';
    process.env.DB_URI = dbUri;
    mongoose.connect.mockResolvedValueOnce(mockConnection);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(dbUri, { bufferCommands: false });
  });

  it('should throw error if DB_URI is not set', () => {
    delete process.env.DB_URI;
    global.mongoose = undefined;

    expect(() => {
      require('@/lib/mongodb');
    }).toThrow();
  });

  it('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(error);
    process.env.DB_URI = 'mongodb://localhost:27017/test';
    global.mongoose = undefined;

    await expect(connectDB()).rejects.toThrow('Connection failed');
  });

  it('should share promise during concurrent connection attempts', async () => {
    const mockConnection = { connection: 'mock' };
    mongoose.connect.mockResolvedValueOnce(mockConnection);
    process.env.DB_URI = 'mongodb://localhost:27017/test';
    global.mongoose = undefined;

    const promises = [connectDB(), connectDB(), connectDB()];
    await Promise.all(promises);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
