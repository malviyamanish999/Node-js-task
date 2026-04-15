import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const result = await service.validateUser('admin', 'admin123');

      expect(result).toEqual({
        id: 1,
        username: 'admin',
      });
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      await expect(service.validateUser('invalid', 'invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with wrong password', async () => {
      await expect(service.validateUser('admin', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access token and user info on successful login', async () => {
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login('admin', 'admin123');

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          username: 'admin',
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'admin',
        sub: 1,
      });
    });

    it('should throw UnauthorizedException on invalid login', async () => {
      await expect(service.login('invalid', 'invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
