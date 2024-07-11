import { UserRepository } from 'src/user/user.repository';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';

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
  });
});
