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
      providers: [UserRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    repository = mockModule.get<UserRepository>(UserRepository);
    mockPrisma = mockModule.get(PrismaService);
  });

  describe('findUserOrCreate', () => {
    it('should find user if exists', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      expect(await repository.findUserOrCreate(user)).toBe(user);
    });

    it('should create user if not exists', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(user);
      expect(await repository.findUserOrCreate(user)).toBe(user);
    });

    it('should throw internalServerException if findUnique fails with database error', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockRejectedValue(new Error());
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });

    it('should throw internalServerException if create fails', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockRejectedValue(new Error());
      await expect(repository.findUserOrCreate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('findUserAndUpdate', () => {
    it('should find user if exists', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.update.mockResolvedValue(user);
      expect(await repository.findUserAndUpdate(user)).toBe(user);
    });

    it('should throw notFoundException if user not found', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.update.mockRejectedValue(new Error());
      await expect(repository.findUserAndUpdate(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('setConsent', () => {
    it('should update user consent', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.update.mockResolvedValue(user);
      expect(await repository.setConsent(user)).toBe(user);
    });

    it('should throw notFoundException if user not found', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.update.mockRejectedValue(new Error());
      await expect(repository.setConsent(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('findUserByName', () => {
    it('should find user by name', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findFirst.mockResolvedValue(user);
      expect(await repository.findUserByName(user)).toBe(user);
    });

    it('should throw internalServerException if findFirst fails with database error', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findFirst.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.findUserByName(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if findFirst fails with unexpected error', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.findFirst.mockRejectedValue(new Error());
      await expect(repository.findUserByName(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('createTempUser', () => {
    it('should create temporary user', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(user);
      expect(await repository.createTempUser(user)).toBe(user);
    });

    it('should throw internalServerException if create fails with database error', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockRejectedValue(
        new PrismaClientKnownRequestError('error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.createTempUser(user)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if create fails with unexpected error', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockRejectedValue(new Error());
      await expect(repository.createTempUser(user)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });
});
