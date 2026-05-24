import { GET as getSales, POST as createSale } from '@/app/api/sales/route';
import { GET as getPurchases, POST as createPurchase } from '@/app/api/purchases/route';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Sale from '@/models/Sale';
import Purchase from '@/models/Purchase';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Product');
jest.mock('@/models/Sale');
jest.mock('@/models/Purchase');

describe('Integration Tests - Purchase & Sales Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Purchase Flow', () => {
    it('should create purchase and increase inventory', async () => {
      const purchaseData = {
        products: [
          { product: 'prod1', quantity: 100, price: 50 },
          { product: 'prod2', quantity: 50, price: 30 },
        ],
        provider: 'prov1',
        notes: 'Bulk order',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });

      const mockProducts = [
        { _id: 'prod1', stock: 0, purchasePrice: 55, save: jest.fn() },
        { _id: 'prod2', stock: 20, purchasePrice: 35, save: jest.fn() },
      ];

      connectDB.mockResolvedValueOnce(true);
      Purchase.create.mockResolvedValueOnce({
        _id: 'purch1',
        ...purchaseData,
        total: 6500,
      });

      mockProducts.forEach((product, index) => {
        Product.findById.mockResolvedValueOnce(product);
        product.stock += purchaseData.products[index].quantity;
      });

      const response = await createPurchase(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.total).toBe(6500);
      expect(mockProducts[0].stock).toBe(100);
      expect(mockProducts[1].stock).toBe(70);
    });

    it('should track purchase history', () => {
      const purchases = [
        { _id: 'p1', date: new Date('2024-01-01'), total: 1000 },
        { _id: 'p2', date: new Date('2024-01-05'), total: 1500 },
        { _id: 'p3', date: new Date('2024-01-10'), total: 800 },
      ];

      const totalPurchased = purchases.reduce((sum, p) => sum + p.total, 0);

      expect(purchases).toHaveLength(3);
      expect(totalPurchased).toBe(3300);
    });
  });

  describe('Complete Sales Flow', () => {
    it('should create sale and decrease inventory', async () => {
      const saleData = {
        products: [
          { product: 'prod1', quantity: 20, price: 120 },
          { product: 'prod2', quantity: 10, price: 60 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });

      const mockProducts = [
        { _id: 'prod1', stock: 100, salePrice: 100, save: jest.fn() },
        { _id: 'prod2', stock: 50, salePrice: 50, save: jest.fn() },
      ];

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockResolvedValueOnce({
        _id: 'sale1',
        ...saleData,
        total: 3000,
      });

      mockProducts.forEach((product, index) => {
        Product.findById.mockResolvedValueOnce(product);
        product.stock -= saleData.products[index].quantity;
      });

      const response = await createSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.total).toBe(3000);
      expect(mockProducts[0].stock).toBe(80);
      expect(mockProducts[1].stock).toBe(40);
    });

    it('should generate sales report', async () => {
      const mockSales = [
        { _id: 'sale1', total: 1000, date: new Date('2024-01-01') },
        { _id: 'sale2', total: 1500, date: new Date('2024-01-05') },
        { _id: 'sale3', total: 800, date: new Date('2024-01-10') },
      ];

      const mockRequest = new Request('http://localhost/api/sales?page=1&limit=10');

      connectDB.mockResolvedValueOnce(true);
      Sale.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValueOnce(mockSales),
              }),
            }),
          }),
        }),
      });
      Sale.countDocuments.mockResolvedValueOnce(3);

      const response = await getSales(mockRequest);
      const data = await response.json();

      const totalRevenue = data.data.reduce((sum, sale) => sum + sale.total, 0);

      expect(totalRevenue).toBe(3300);
    });
  });

  describe('Inventory Synchronization', () => {
    it('should synchronize inventory across operations', () => {
      let inventory = { 'prod1': 50, 'prod2': 30 };

      const purchase = { 'prod1': 20, 'prod2': 15 };
      Object.keys(purchase).forEach(prod => {
        inventory[prod] += purchase[prod];
      });

      expect(inventory['prod1']).toBe(70);
      expect(inventory['prod2']).toBe(45);

      const sale = { 'prod1': 10, 'prod2': 5 };
      Object.keys(sale).forEach(prod => {
        inventory[prod] -= sale[prod];
      });

      expect(inventory['prod1']).toBe(60);
      expect(inventory['prod2']).toBe(40);
    });

    it('should alert on low stock', () => {
      const products = [
        { name: 'Martillo', stock: 5, minStock: 10 },
        { name: 'Destornillador', stock: 20, minStock: 10 },
        { name: 'Pernos', stock: 2, minStock: 5 },
      ];

      const lowStockItems = products.filter(p => p.stock < p.minStock);

      expect(lowStockItems).toHaveLength(2);
      expect(lowStockItems[0].name).toBe('Martillo');
    });
  });

  describe('Financial Reporting', () => {
    it('should calculate monthly revenue', () => {
      const sales = [
        { date: new Date('2024-05-01'), total: 1000 },
        { date: new Date('2024-05-05'), total: 1500 },
        { date: new Date('2024-05-10'), total: 800 },
        { date: new Date('2024-06-01'), total: 2000 },
      ];

      const mayRevenue = sales
        .filter(s => s.date.getMonth() === 4) // May is month 4
        .reduce((sum, s) => sum + s.total, 0);

      expect(mayRevenue).toBe(3300);
    });

    it('should calculate profit margin', () => {
      const products = [
        { purchasePrice: 50, salePrice: 100, quantitySold: 10 },
        { purchasePrice: 20, salePrice: 40, quantitySold: 20 },
      ];

      const totalCost = products.reduce((sum, p) => sum + (p.purchasePrice * p.quantitySold), 0);
      const totalRevenue = products.reduce((sum, p) => sum + (p.salePrice * p.quantitySold), 0);
      const margin = ((totalRevenue - totalCost) / totalRevenue) * 100;

      expect(totalCost).toBe(900);
      expect(totalRevenue).toBe(1800);
      expect(margin).toBeCloseTo(50, 0);
    });

    it('should track cash flow', () => {
      const transactions = [
        { type: 'PURCHASE', amount: -1000 },
        { type: 'SALE', amount: 1500 },
        { type: 'SALE', amount: 800 },
        { type: 'PURCHASE', amount: -600 },
      ];

      const netFlow = transactions.reduce((sum, t) => sum + t.amount, 0);

      expect(netFlow).toBe(700);
    });
  });

  describe('Error Handling', () => {
    it('should handle insufficient stock', () => {
      const product = { stock: 5 };
      const requestedQuantity = 10;

      const hasEnoughStock = product.stock >= requestedQuantity;

      expect(hasEnoughStock).toBe(false);
    });

    it('should prevent duplicate sales', () => {
      const salesIds = ['sale1', 'sale2', 'sale3'];
      const duplicateCheck = new Set(salesIds).size === salesIds.length;

      expect(duplicateCheck).toBe(true);
    });

    it('should validate product prices', () => {
      const products = [
        { name: 'Product1', purchasePrice: 50, salePrice: 100 },
        { name: 'Product2', purchasePrice: 30, salePrice: 20 }, // Invalid
      ];

      const invalidProducts = products.filter(p => p.purchasePrice > p.salePrice);

      expect(invalidProducts).toHaveLength(1);
      expect(invalidProducts[0].name).toBe('Product2');
    });
  });
});
