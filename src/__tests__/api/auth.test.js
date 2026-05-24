import { POST as loginHandler } from '@/app/api/auth/login/route';
import { connectDB } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');
jest.mock('@/models/User');
jest.mock('bcryptjs');

describe('Login API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      _id: 'user123',
      user_name: 'testuser',
      password: 'hashedpassword',
      email: 'test@example.com',
      rol: 'user',
      phone: '1234567890',
      created: new Date(),
    };

    const mockRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    connectDB.mockResolvedValueOnce(true);
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(true);
    signToken.mockReturnValueOnce('mock-token');

    const response = await loginHandler(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Login exitoso');
    expect(connectDB).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ user_name: 'testuser' });
  });

  it('should return 404 if user not found', async () => {
    const mockRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'nonexistent', password: 'password' }),
    });

    connectDB.mockResolvedValueOnce(true);
    User.findOne.mockResolvedValueOnce(null);

    const response = await loginHandler(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Usuario no encontrado');
  });

  it('should return 401 if password is incorrect', async () => {
    const mockUser = {
      _id: 'user123',
      user_name: 'testuser',
      password: 'hashedpassword',
    };

    const mockRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'wrongpassword' }),
    });

    connectDB.mockResolvedValueOnce(true);
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await loginHandler(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Contraseña incorrecta');
  });

  it('should return 500 on database error', async () => {
    const mockRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password' }),
    });

    connectDB.mockRejectedValueOnce(new Error('Database connection failed'));

    const response = await loginHandler(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Database connection failed');
  });

  it('should set secure cookie on successful login', async () => {
    const mockUser = {
      _id: 'user123',
      user_name: 'testuser',
      password: 'hashedpassword',
      email: 'test@example.com',
      rol: 'admin',
      phone: '1234567890',
      created: new Date(),
    };

    const mockRequest = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    connectDB.mockResolvedValueOnce(true);
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(true);
    signToken.mockReturnValueOnce('mock-token');

    const response = await loginHandler(mockRequest);

    expect(response.status).toBe(200);
    expect(signToken).toHaveBeenCalledWith({
      id: 'user123',
      username: 'testuser',
    });
  });
});
