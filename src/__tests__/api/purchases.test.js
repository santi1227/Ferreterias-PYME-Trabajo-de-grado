import { GET as getPurchases, POST as createPurchase, PUT as updatePurchase } from '@/app/api/purchases/route';
import { connectDB } from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import Provider from '@/models/Provider';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Purchase');
jest.mock('@/models/Product');
jest.mock('@/models/Provider');

describe('Purchases API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/purchases', () => {
    it('should return paginated purchases list', async () => {
      const mockPurchases = [
        { _id: '1', total: 500, products: [], provider: { name: 'Provider1' } },
        { _id: '2', total: 1500, products: [], provider: { name: 'Provider2' } },
      ];

      const mockRequest = new Request('http://localhost/api/purchases?page=1&limit=10');

      connectDB.mockResolvedValueOnce(true);
      Purchase.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValueOnce(mockPurchases),
              }),
            }),
          }),
        }),
      });
      Purchase.countDocuments.mockResolvedValueOnce(2);

      const response = await getPurchases(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.total).toBe(2);
    });

    it('should handle pagination', async () => {
      const mockRequest = new Request('http://localhost/api/purchases?page=1&limit=5');

      connectDB.mockResolvedValueOnce(true);
      Purchase.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValueOnce([]),
              }),
            }),
          }),
        }),
      });
      Purchase.countDocuments.mockResolvedValueOnce(0);

      const response = await getPurchases(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/purchases', () => {
    it('should create a new purchase', async () => {
      const purchaseData = {
        products: [
          { product: 'prod1', quantity: 10, price: 50 },
        ],
        provider: 'prov1',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });

      const mockProduct = { _id: 'prod1', stock: 0, purchasePrice: 50, save: jest.fn() };
      const mockNewPurchase = {
        _id: 'purch1',
        ...purchaseData,
        total: 500,
      };

      connectDB.mockResolvedValueOnce(true);
      Purchase.create.mockResolvedValueOnce(mockNewPurchase);
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createPurchase(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.total).toBe(500);
    });

    it('should increase product stock on purchase', async () => {
      const purchaseData = {
        products: [
          { product: 'prod1', quantity: 20, price: 40 },
        ],
        provider: 'prov1',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });

      const mockProduct = { _id: 'prod1', stock: 10, purchasePrice: 40, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Purchase.create.mockResolvedValueOnce({ _id: 'purch1', ...purchaseData, total: 800 });
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createPurchase(mockRequest);

      expect(mockProduct.stock).toBe(30);
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should update purchase price if lower', async () => {
      const purchaseData = {
        products: [
          { product: 'prod1', quantity: 5, price: 30 },
        ],
        provider: 'prov1',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });

      const mockProduct = { _id: 'prod1', stock: 10, purchasePrice: 50, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Purchase.create.mockResolvedValueOnce({ _id: 'purch1', ...purchaseData, total: 150 });
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createPurchase(mockRequest);

      expect(mockProduct.purchasePrice).toBe(30);
    });

    it('should calculate total correctly', async () => {
      const purchaseData = {
        products: [
          { product: 'prod1', quantity: 2, price: 100 },
          { product: 'prod2', quantity: 3, price: 50 },
        ],
        provider: 'prov1',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
      });

      connectDB.mockResolvedValueOnce(true);
      Purchase.create.mockImplementationOnce((data) => {
        return Promise.resolve({
          _id: 'purch1',
          ...data,
        });
      });
      Product.findById.mockResolvedValue({ _id: 'prod1', stock: 0, purchasePrice: 100, save: jest.fn() });

      const response = await createPurchase(mockRequest);
      const data = await response.json();

      expect(data.total).toBe(350);
    });
  });

  describe('PUT /api/purchases', () => {
    it('should update an existing purchase', async () => {
      const purchaseUpdate = {
        _id: 'purch1',
        products: [
          { product: 'prod1', quantity: 15, price: 45 },
        ],
        provider: 'prov1',
      };

      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'PUT',
        body: JSON.stringify(purchaseUpdate),
      });

      const mockOldPurchase = {
        _id: 'purch1',
        products: [{ product: 'prod1', quantity: 10 }],
      };

      const mockProduct = { _id: 'prod1', stock: 10, purchasePrice: 45, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Purchase.findById.mockResolvedValueOnce(mockOldPurchase);
      Product.findById.mockResolvedValue(mockProduct);
      Purchase.findByIdAndUpdate.mockResolvedValueOnce({
        _id: 'purch1',
        ...purchaseUpdate,
        total: 675,
      });

      const response = await updatePurchase(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe('purch1');
    });

    it('should return 404 if purchase not found', async () => {
      const mockRequest = new Request('http://localhost/api/purchases', {
        method: 'PUT',
        body: JSON.stringify({ _id: 'nonexistent', products: [] }),
      });

      connectDB.mockResolvedValueOnce(true);
      Purchase.findById.mockResolvedValueOnce(null);

      const response = await updatePurchase(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Compra no encontrada');
    });
  });
});
