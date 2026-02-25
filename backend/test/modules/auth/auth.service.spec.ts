import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../../database/entities/user.entity';
import { CustomLogger } from '../../common/logger';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };
  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CustomLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUserRepo.create.mockReturnValue({ ...registerDto, password: 'hashed-password' });
      mockUserRepo.save.mockResolvedValue({
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
      });

      const result = await service.register(registerDto);

      expect(result.message).toBe('User registered successfully');
      expect(result.access_token).toBe('mock-token');
      expect(result.user.email).toBe('john@example.com');
    });

    it('should throw BadRequestException for duplicate email', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginDto = { email: 'john@example.com', password: 'password123' };

    it('should login with valid credentials', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 'user-id',
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result.message).toBe('User logged in successfully');
      expect(result.access_token).toBe('mock-token');
    });

    it('should throw BadRequestException for wrong password', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: 'user-id',
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for non-existent user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-id');

      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for non-existent user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.getProfile('non-existent')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
