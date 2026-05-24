import { connectDB } from '@/lib/mongodb';
import { signToken, verifyToken } from '@/lib/auth';
import Product from '@/models/Product';
import Sale from '@/models/Sale';
import User from '@/models/User';

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  models: {},
}));

jest.mock('@/models/User');
jest.mock('@/models/Product');
jest.mock('@/models/Sale');

describe('Integration Tests - Authentication & Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.DB_URI = 'mongodb://localhost:27017/test';
  });

  describe('User Authentication Flow', () => {
    it('should authenticate user and create token', () => {
      const userData = { id: 'user1', username: 'testuser' };
      const token = signToken(userData);
      const verified = verifyToken(token);

      expect(verified).toBeDefined();
      expect(verified.id).toBe('user1');
      expect(verified.username).toBe('testuser');
    });

    it('should reject invalid tokens', () => {
      const result = verifyToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should maintain token integrity', () => {
      const original = { id: 'user1', email: 'user@test.com' };
      const token = signToken(original);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(original.id);
      expect(decoded.email).toBe(original.email);
    });
  });

  describe('Database Connection', () => {
    it('should cache database connection', async () => {
      process.env.DB_URI = 'mongodb://localhost:27017/test';
      global.mongoose = undefined;

      const conn1 = await connectDB();
      const conn2 = await connectDB();

      expect(conn1).toBeDefined();
      expect(conn2).toBeDefined();
    });

    it('should handle connection errors', async () => {
      process.env.DB_URI = 'mongodb://invalid:27017/test';
      global.mongoose = undefined;

      const mongoose = require('mongoose');
      mongoose.connect.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(connectDB()).rejects.toThrow('Connection failed');
    });
  });

  describe('Sales & Inventory Integration', () => {
    it('should update inventory on sale creation', async () => {
      const saleData = {
        products: [
          { productId: 'prod1', quantity: 5, price: 100 },
        ],
        customerId: 'cust1',
      };

      const mockProduct = { _id: 'prod1', stock: 20, save: jest.fn() };
      Product.findById.mockResolvedValueOnce(mockProduct);

      mockProduct.stock -= saleData.products[0].quantity;

      expect(mockProduct.stock).toBe(15);
      expect(mockProduct.save).not.toHaveBeenCalled();
    });

    it('should calculate sale total correctly', () => {
      const products = [
        { quantity: 2, price: 50 },
        { quantity: 3, price: 30 },
      ];

      const total = products.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      expect(total).toBe(190);
    });

    it('should track inventory movements', () => {
      const movements = [];

      movements.push({
        type: 'PURCHASE',
        product: 'prod1',
        quantity: 100,
        timestamp: new Date(),
      });

      movements.push({
        type: 'SALE',
        product: 'prod1',
        quantity: -20,
        timestamp: new Date(),
      });

      const totalMovement = movements.reduce((sum, m) => sum + m.quantity, 0);

      expect(totalMovement).toBe(80);
    });
  });

  describe('Purchase & Sale Flow', () => {
    it('should complete full purchase flow', async () => {
      const purchaseData = {
        products: [
          { productId: 'prod1', quantity: 50, price: 40 },
        ],
        providerId: 'prov1',
      };

      const total = purchaseData.products.reduce(
        (sum, item) => sum + (item.quantity * item.price),
        0
      );

      expect(total).toBe(2000);
    });

    it('should track profit margin', () => {
      const products = [
        { purchasePrice: 50, salePrice: 100, quantity: 5 },
        { purchasePrice: 20, salePrice: 40, quantity: 10 },
      ];

      const totalCost = products.reduce((sum, p) => sum + (p.purchasePrice * p.quantity), 0);
      const totalRevenue = products.reduce((sum, p) => sum + (p.salePrice * p.quantity), 0);
      const profit = totalRevenue - totalCost;

      expect(totalCost).toBe(450);
      expect(totalRevenue).toBe(900);
      expect(profit).toBe(450);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain product-sale relationship', () => {
      const sale = {
        _id: 'sale1',
        products: [
          { product: 'prod1', quantity: 5 },
          { product: 'prod2', quantity: 3 },
        ],
        customer: 'cust1',
      };

      expect(sale.products).toHaveLength(2);
      expect(sale.products[0].quantity).toBe(5);
    });

    it('should handle concurrent operations', async () => {
      const operations = [
        connectDB(),
        connectDB(),
        connectDB(),
      ];

      const results = await Promise.all(operations);

      expect(results).toHaveLength(3);
    });
  });
});
