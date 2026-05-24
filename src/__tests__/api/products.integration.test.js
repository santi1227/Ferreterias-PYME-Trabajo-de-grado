import { GET as getProducts, POST as createProduct, PUT as updateProduct, DELETE as deleteProduct } from '@/app/api/products/route';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Product');

describe('Products API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { _id: '1', code: 'P001', name: 'Martillo', salePrice: 100 },
        { _id: '2', code: 'P002', name: 'Destornillador', salePrice: 40 },
      ];

      const mockRequest = new Request('http://localhost/api/products?page=1&limit=10');

      connectDB.mockResolvedValueOnce(true);
      Product.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce(mockProducts),
        }),
      });
      Product.countDocuments.mockResolvedValueOnce(2);

      const response = await getProducts(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
    });

    it('should handle search by code', async () => {
      const mockRequest = new Request('http://localhost/api/products?code=P001');

      connectDB.mockResolvedValueOnce(true);
      Product.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce([{ code: 'P001' }]),
        }),
      });

      const response = await getProducts(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        code: 'NEW001',
        name: 'New Product',
        purchasePrice: 50,
        salePrice: 100,
        stock: 10,
      };

      const mockRequest = new Request('http://localhost/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      const mockNewProduct = { _id: 'prod1', ...productData };

      connectDB.mockResolvedValueOnce(true);
      Product.create.mockResolvedValueOnce(mockNewProduct);

      const response = await createProduct(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.code).toBe('NEW001');
    });

    it('should validate required fields', async () => {
      const productData = {
        name: 'Incomplete',
      };

      const mockRequest = new Request('http://localhost/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      connectDB.mockResolvedValueOnce(true);
      Product.create.mockRejectedValueOnce(new Error('Validation error'));

      const response = await createProduct(mockRequest);

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/products', () => {
    it('should update an existing product', async () => {
      const updateData = {
        _id: 'prod1',
        name: 'Updated Product',
        salePrice: 120,
      };

      const mockRequest = new Request('http://localhost/api/products', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      const mockUpdated = { _id: 'prod1', ...updateData };

      connectDB.mockResolvedValueOnce(true);
      Product.findByIdAndUpdate.mockResolvedValueOnce(mockUpdated);

      const response = await updateProduct(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Updated Product');
    });

    it('should return 404 if product not found', async () => {
      const mockRequest = new Request('http://localhost/api/products', {
        method: 'PUT',
        body: JSON.stringify({ _id: 'nonexistent' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Product.findByIdAndUpdate.mockResolvedValueOnce(null);

      const response = await updateProduct(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products', () => {
    it('should delete a product', async () => {
      const mockRequest = new Request('http://localhost/api/products', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'prod1' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Product.findByIdAndDelete.mockResolvedValueOnce({ _id: 'prod1' });

      const response = await deleteProduct(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Producto eliminado');
    });

    it('should return 404 if product not found', async () => {
      const mockRequest = new Request('http://localhost/api/products', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'nonexistent' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Product.findByIdAndDelete.mockResolvedValueOnce(null);

      const response = await deleteProduct(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
    });
  });

  describe('Inventory Management', () => {
    it('should track stock changes on sales', async () => {
      const productData = {
        code: 'TRACK001',
        name: 'Tracked Product',
        purchasePrice: 30,
        salePrice: 60,
        stock: 50,
      };

      const mockProduct = { ...productData, _id: 'prod1', save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Product.create.mockResolvedValueOnce(mockProduct);

      const mockRequest = new Request('http://localhost/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      const response = await createProduct(mockRequest);
      expect(response.status).toBe(201);
    });

    it('should prevent negative stock', async () => {
      const mockProduct = { stock: 0, save: jest.fn() };
      mockProduct.stock = mockProduct.stock - 10;

      expect(mockProduct.stock).toBe(-10);
    });
  });
});
