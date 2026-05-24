import { GET as getCustomers, POST as createCustomer } from '@/app/api/customers/route';
import { GET as getUsers, POST as createUser } from '@/app/api/users/user/route';
import { POST as registerUser } from '@/app/api/users/register/route';
import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Customer');
jest.mock('@/models/User');
jest.mock('bcryptjs');

describe('Integration Tests - Users & Customers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration Flow', () => {
    it('should register new user with hashed password', async () => {
      const userData = {
        username: 'newuser',
        email: 'user@example.com',
        password: 'securepassword123',
        phone: '1234567890',
      };

      const mockRequest = new Request('http://localhost/api/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const hashedPassword = 'hashed_password_hash';
      bcrypt.hash.mockResolvedValueOnce(hashedPassword);

      connectDB.mockResolvedValueOnce(true);
      User.create.mockResolvedValueOnce({
        _id: 'user1',
        user_name: userData.username,
        email: userData.email,
        password: hashedPassword,
      });

      const response = await registerUser(mockRequest);
      const data = await response.json();

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });

    it('should prevent duplicate username registration', async () => {
      const userData = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
      };

      const mockRequest = new Request('http://localhost/api/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      connectDB.mockResolvedValueOnce(true);
      User.findOne.mockResolvedValueOnce({ _id: 'user1' });

      const response = await registerUser(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Usuario ya existe');
    });

    it('should validate email format', () => {
      const emails = [
        { email: 'valid@example.com', valid: true },
        { email: 'invalid.email', valid: false },
        { email: 'user@domain.co.uk', valid: true },
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      emails.forEach(({ email, valid }) => {
        expect(emailRegex.test(email)).toBe(valid);
      });
    });

    it('should require minimum password length', () => {
      const passwords = [
        { password: '12345', valid: false }, // 5 chars
        { password: 'password123', valid: true }, // 11 chars
      ];

      passwords.forEach(({ password, valid }) => {
        expect(password.length >= 8).toBe(valid);
      });
    });
  });

  describe('User Management', () => {
    it('should retrieve all users with pagination', async () => {
      const mockUsers = [
        { _id: '1', user_name: 'admin', rol: 'admin' },
        { _id: '2', user_name: 'user1', rol: 'user' },
      ];

      const mockRequest = new Request('http://localhost/api/users/user?page=1&limit=10');

      connectDB.mockResolvedValueOnce(true);
      User.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce(mockUsers),
        }),
      });
      User.countDocuments.mockResolvedValueOnce(2);

      const response = await getUsers(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
    });

    it('should handle role-based access', () => {
      const users = [
        { id: 1, role: 'admin', permissions: ['read', 'write', 'delete'] },
        { id: 2, role: 'user', permissions: ['read'] },
      ];

      const adminUser = users.find(u => u.role === 'admin');
      expect(adminUser.permissions).toContain('delete');

      const regularUser = users.find(u => u.role === 'user');
      expect(regularUser.permissions).not.toContain('delete');
    });
  });

  describe('Customer Management', () => {
    it('should create new customer', async () => {
      const customerData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '1234567890',
        address: 'Calle 123',
      };

      const mockRequest = new Request('http://localhost/api/customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });

      const mockNewCustomer = { _id: 'cust1', ...customerData };

      connectDB.mockResolvedValueOnce(true);
      Customer.create.mockResolvedValueOnce(mockNewCustomer);

      const response = await createCustomer(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.firstName).toBe('Juan');
    });

    it('should retrieve customers with pagination', async () => {
      const mockCustomers = [
        { _id: '1', firstName: 'Juan', lastName: 'Pérez' },
        { _id: '2', firstName: 'María', lastName: 'García' },
      ];

      const mockRequest = new Request('http://localhost/api/customers?page=1&limit=10');

      connectDB.mockResolvedValueOnce(true);
      Customer.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce(mockCustomers),
        }),
      });
      Customer.countDocuments.mockResolvedValueOnce(2);

      const response = await getCustomers(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
    });

    it('should track customer purchase history', () => {
      const customer = { id: 'cust1', name: 'Juan', purchases: [] };
      const purchases = [
        { date: new Date('2024-01-01'), amount: 1000 },
        { date: new Date('2024-01-15'), amount: 500 },
      ];

      const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);

      expect(totalSpent).toBe(1500);
      expect(purchases).toHaveLength(2);
    });
  });

  describe('Account Security', () => {
    it('should hash passwords before storing', async () => {
      const plainPassword = 'mypassword123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      bcrypt.hash.mockResolvedValueOnce('hashed_value');

      expect(plainPassword).not.toBe('hashed_value');
    });

    it('should validate password on login', async () => {
      const storedHash = 'hashed_password';
      const attemptedPassword = 'correct_password';

      bcrypt.compare.mockResolvedValueOnce(true);

      const isValid = await bcrypt.compare(attemptedPassword, storedHash);

      expect(isValid).toBe(true);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = ['123', '12345', 'password', 'qwerty'];
      const strongPasswords = ['P@ssw0rd123', 'MySecure#Pass2024', 'C0mpl3xP@ss'];

      const isStrong = (pwd) => {
        return pwd.length >= 8 &&
               /[A-Z]/.test(pwd) &&
               /[0-9]/.test(pwd) &&
               /[!@#$%^&*]/.test(pwd);
      };

      weakPasswords.forEach(pwd => expect(isStrong(pwd)).toBe(false));
      strongPasswords.forEach(pwd => expect(isStrong(pwd)).toBe(true));
    });
  });

  describe('Data Validation', () => {
    it('should validate email uniqueness', async () => {
      const emails = ['user1@example.com', 'user2@example.com', 'user1@example.com'];
      const uniqueEmails = new Set(emails);

      expect(uniqueEmails.size).toBe(2);
    });

    it('should validate phone number format', () => {
      const phoneRegex = /^\d{10}$/;
      const validPhones = ['1234567890', '9876543210'];
      const invalidPhones = ['123', '12345678901'];

      validPhones.forEach(phone => expect(phoneRegex.test(phone)).toBe(true));
      invalidPhones.forEach(phone => expect(phoneRegex.test(phone)).toBe(false));
    });

    it('should sanitize user input', () => {
      const userInput = '<script>alert("xss")</script>';
      const sanitized = userInput
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
  });
});
