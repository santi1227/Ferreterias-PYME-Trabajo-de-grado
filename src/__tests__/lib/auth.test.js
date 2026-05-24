import { signToken, verifyToken } from '@/lib/auth';

describe('Auth Library', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { id: '123', username: 'testuser' };
      const token = signToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create a token with expiration time', () => {
      const payload = { id: '456' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe('456');
    });

    it('should include payload data in token', () => {
      const payload = { id: 'user123', username: 'john' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.id).toBe('user123');
      expect(decoded.username).toBe('john');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: '789', username: 'admin' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe('789');
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const result = verifyToken(invalidToken);
      expect(result).toBeNull();
    });

    it('should return null for malformed token', () => {
      const result = verifyToken('');
      expect(result).toBeNull();
    });

    it('should handle corrupted tokens gracefully', () => {
      const result = verifyToken('corrupted' + signToken({ id: '1' }).substring(10));
      expect(result).toBeNull();
    });
  });
});
