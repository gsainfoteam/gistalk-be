import { UserRepository } from 'src/user/user.repository';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    repository = mockModule.get<UserRepository>(UserRepository);
    mockPrisma = mockModule.get(PrismaService);
  });

  describe('findUserOrCreate', () => {
    it('should be defined', () => {
      expect(repository.findUserOrCreate).toBeDefined();
    });

    // mock user object
    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should find user if exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(user);
      expect(await repository.findUserOrCreate(user)).toBe(user);
    });

    it('should create user if not exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(user);
      expect(await repository.findUserOrCreate(user)).toBe(user);
    });

    it('should throw internalServerException if findUnique fails with database error', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if findUnique fails with unexpected error', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error());
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });

    it('should throw internalServerException if create fails', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if create fails with unexpected error', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockRejectedValue(new Error());
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('findUserAndUpdate', () => {
    it('should be defined', () => {
      expect(repository.findUserAndUpdate).toBeDefined();
    });

    // mock user object
    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should find user if exists', async () => {
      mockPrisma.user.update.mockResolvedValue(user);
      expect(await repository.findUserAndUpdate(user)).toBe(user);
    });

    it('should throw notFoundException if user not found', async () => {
      mockPrisma.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2025',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.findUserAndUpdate(user)).rejects.toThrow(
        new NotFoundException('user not found'),
      );
    });

    it('should throw internalServerException if update fails with database error', async () => {
      mockPrisma.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.findUserAndUpdate(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if update fails with unexpected error', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error());
      await expect(repository.findUserAndUpdate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('setConsent', () => {
    it('should be defined', () => {
      expect(repository.setConsent).toBeDefined();
    });

    // mock user object
    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should update user consent', async () => {
      mockPrisma.user.update.mockResolvedValue(user);
      expect(await repository.setConsent(user)).toBe(user);
    });

    it('should throw notFoundException if user not found', async () => {
      mockPrisma.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2025',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.setConsent(user)).rejects.toThrow(
        new NotFoundException('user not found'),
      );
    });

    it('should throw internalServerException if update fails with database error', async () => {
      mockPrisma.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.setConsent(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if update fails with unexpected error', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error());
      await expect(repository.setConsent(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });
});
