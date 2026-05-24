import mongoose from 'mongoose';
import Product from '@/models/Product';

jest.mock('@/lib/mongodb');

describe('Product Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('Product Schema Validation', () => {
    it('should create a product with all required fields', async () => {
      const productData = {
        code: 'PROD001',
        name: 'Martillo',
        purchasePrice: 50,
        salePrice: 100,
      };

      const product = new Product(productData);
      const savedProduct = await product.save();

      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.code).toBe('PROD001');
      expect(savedProduct.name).toBe('Martillo');
      expect(savedProduct.purchasePrice).toBe(50);
      expect(savedProduct.salePrice).toBe(100);
    });

    it('should fail if required fields are missing', async () => {
      const productData = {
        name: 'Incomplete Product',
      };

      const product = new Product(productData);

      await expect(product.save()).rejects.toThrow();
    });

    it('should enforce unique code constraint', async () => {
      const productData1 = {
        code: 'UNIQUE001',
        name: 'Product 1',
        purchasePrice: 10,
        salePrice: 20,
      };

      const productData2 = {
        code: 'UNIQUE001',
        name: 'Product 2',
        purchasePrice: 15,
        salePrice: 25,
      };

      await Product.create(productData1);

      await expect(Product.create(productData2)).rejects.toThrow();
    });

    it('should have default values for optional fields', async () => {
      const productData = {
        code: 'DEFAULT001',
        name: 'Test Product',
        purchasePrice: 20,
        salePrice: 40,
      };

      const product = await Product.create(productData);

      expect(product.stock).toBe(0);
      expect(product.created).toBeDefined();
      expect(product.updated).toBeDefined();
    });

    it('should allow optional fields', async () => {
      const productData = {
        code: 'OPTIONAL001',
        name: 'Product with extras',
        description: 'A great product',
        purchasePrice: 30,
        salePrice: 60,
        category: 'Herramientas',
        stock: 50,
      };

      const product = await Product.create(productData);

      expect(product.description).toBe('A great product');
      expect(product.category).toBe('Herramientas');
      expect(product.stock).toBe(50);
    });

    it('should update timestamps on modification', async () => {
      const productData = {
        code: 'TIMESTAMP001',
        name: 'Product',
        purchasePrice: 25,
        salePrice: 50,
      };

      const product = await Product.create(productData);
      const createdAt = product.createdAt;

      await new Promise(resolve => setTimeout(resolve, 100));

      product.name = 'Updated Product';
      await product.save();

      expect(product.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
    });
  });

  describe('Product Queries', () => {
    beforeEach(async () => {
      await Product.create([
        { code: 'P001', name: 'Martillo', purchasePrice: 50, salePrice: 100, category: 'Herramientas' },
        { code: 'P002', name: 'Destornillador', purchasePrice: 20, salePrice: 40, category: 'Herramientas' },
        { code: 'P003', name: 'Pernos', purchasePrice: 1, salePrice: 3, category: 'Accesorios' },
      ]);
    });

    it('should find product by code', async () => {
      const product = await Product.findOne({ code: 'P001' });

      expect(product).toBeDefined();
      expect(product.name).toBe('Martillo');
    });

    it('should find products by category', async () => {
      const products = await Product.find({ category: 'Herramientas' });

      expect(products).toHaveLength(2);
    });

    it('should return null when product not found', async () => {
      const product = await Product.findOne({ code: 'NONEXISTENT' });

      expect(product).toBeNull();
    });
  });
});
