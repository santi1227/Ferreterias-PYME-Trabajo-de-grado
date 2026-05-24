import { GET as getSales, POST as createSale, PUT as updateSale, DELETE as deleteSale } from '@/app/api/sales/route';
import { connectDB } from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Customer from '@/models/Customer';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Sale');
jest.mock('@/models/Product');
jest.mock('@/models/Customer');

describe('Sales API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/sales', () => {
    it('should return paginated sales list', async () => {
      const mockSales = [
        { _id: '1', total: 1000, products: [], customer: { firstName: 'Juan' } },
        { _id: '2', total: 2000, products: [], customer: { firstName: 'Pedro' } },
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
      Sale.countDocuments.mockResolvedValueOnce(2);

      const response = await getSales(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.total).toBe(2);
    });

    it('should handle pagination parameters', async () => {
      const mockRequest = new Request('http://localhost/api/sales?page=2&limit=5');

      connectDB.mockResolvedValueOnce(true);
      Sale.find.mockReturnValue({
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
      Sale.countDocuments.mockResolvedValueOnce(15);

      const response = await getSales(mockRequest);
      const data = await response.json();

      expect(data.page).toBe(2);
      expect(data.totalPages).toBe(3);
    });

    it('should return 500 on database error', async () => {
      const mockRequest = new Request('http://localhost/api/sales');

      connectDB.mockResolvedValueOnce(true);
      Sale.find.mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await getSales(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error al obtener ventas');
    });
  });

  describe('POST /api/sales', () => {
    it('should create a new sale', async () => {
      const saleData = {
        products: [
          { product: 'prod1', quantity: 2, price: 100 },
          { product: 'prod2', quantity: 1, price: 50 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });

      const mockProduct = { _id: 'prod1', stock: 10, salePrice: 100, save: jest.fn() };
      const mockNewSale = {
        _id: 'sale1',
        ...saleData,
        total: 250,
      };

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockResolvedValueOnce(mockNewSale);
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.total).toBe(250);
    });

    it('should calculate total from products', async () => {
      const saleData = {
        products: [
          { product: 'prod1', quantity: 2, price: 100 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockImplementationOnce((data) => {
        return Promise.resolve({
          _id: 'sale1',
          ...data,
        });
      });
      Product.findById.mockResolvedValue({ _id: 'prod1', stock: 10, salePrice: 80, save: jest.fn() });

      const response = await createSale(mockRequest);
      const data = await response.json();

      expect(data.total).toBe(200);
    });

    it('should decrease product stock on sale creation', async () => {
      const saleData = {
        products: [
          { product: 'prod1', quantity: 5, price: 100 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });

      const mockProduct = { _id: 'prod1', stock: 10, salePrice: 80, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockResolvedValueOnce({ _id: 'sale1', ...saleData, total: 500 });
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createSale(mockRequest);

      expect(mockProduct.stock).toBe(5);
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should update sale price if new price is higher', async () => {
      const saleData = {
        products: [
          { product: 'prod1', quantity: 1, price: 150 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });

      const mockProduct = { _id: 'prod1', stock: 10, salePrice: 100, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockResolvedValueOnce({ _id: 'sale1', ...saleData, total: 150 });
      Product.findById.mockResolvedValue(mockProduct);

      const response = await createSale(mockRequest);

      expect(mockProduct.salePrice).toBe(150);
    });

    it('should return 500 on error', async () => {
      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'POST',
        body: JSON.stringify({ products: [], customer: 'cust1' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Sale.create.mockRejectedValueOnce(new Error('Creation failed'));

      const response = await createSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error al crear venta');
    });
  });

  describe('PUT /api/sales', () => {
    it('should update an existing sale', async () => {
      const saleUpdate = {
        _id: 'sale1',
        products: [
          { product: 'prod1', quantity: 3, price: 100 },
        ],
        customer: 'cust1',
      };

      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'PUT',
        body: JSON.stringify(saleUpdate),
      });

      const mockOldSale = {
        _id: 'sale1',
        products: [{ product: 'prod1', quantity: 2 }],
      };

      const mockProduct = { _id: 'prod1', stock: 8, salePrice: 80, save: jest.fn() };

      connectDB.mockResolvedValueOnce(true);
      Sale.findById.mockResolvedValueOnce(mockOldSale);
      Product.findById.mockResolvedValue(mockProduct);
      Sale.findByIdAndUpdate.mockResolvedValueOnce({
        _id: 'sale1',
        ...saleUpdate,
        total: 300,
      });

      const response = await updateSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe('sale1');
    });

    it('should return 404 if sale not found', async () => {
      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'PUT',
        body: JSON.stringify({ _id: 'nonexistent', products: [] }),
      });

      connectDB.mockResolvedValueOnce(true);
      Sale.findById.mockResolvedValueOnce(null);

      const response = await updateSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Venta no encontrada');
    });
  });

  describe('DELETE /api/sales', () => {
    it('should delete a sale', async () => {
      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'sale1' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Sale.findByIdAndDelete.mockResolvedValueOnce({ _id: 'sale1' });

      const response = await deleteSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Venta eliminada');
    });

    it('should return 404 if sale not found', async () => {
      const mockRequest = new Request('http://localhost/api/sales', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'nonexistent' }),
      });

      connectDB.mockResolvedValueOnce(true);
      Sale.findByIdAndDelete.mockResolvedValueOnce(null);

      const response = await deleteSale(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Venta no encontrada');
    });
  });
});
