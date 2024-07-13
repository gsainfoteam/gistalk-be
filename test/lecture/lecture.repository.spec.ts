import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('LectureRepository', () => {
  // let lectureRepository: LectureRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LectureRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    // lectureRepository = moduleRef.get<LectureRepository>(LectureRepository);

    mockPrisma = moduleRef.get(PrismaService);
  });
  const mockLectureRepository = {
    getAll: jest.fn((dto) => {
      return mockPrisma.lecture.findMany({
        where: {
          LectureSection: {
            some: {
              Professor: {
                some: {
                  name: { contains: dto.professorName },
                },
              },
            },
          },
        },
        include: {
          LectureCode: true,
          LectureSection: {
            include: {
              Professor: true,
            },
          },
        },
      });
    }),
  };

  describe('getAll', () => {
    it('should return an array', async () => {
      const result = await mockLectureRepository.getAll({
        professorName: 'name',
      });
      expect(await result).toBeDefined();
      expect(await result).toEqual([]);
    });

    // it('should return lectures with professorName', async () => {
    //   const expectResult = mockPrisma.lecture.findMany({
    //     where: {
    //       LectureSection: {
    //         some: {
    //           Professor: {
    //             some: {
    //               name: {
    //                 contains: 'name',
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     include: {
    //       LectureCode: true,
    //       LectureSection: {
    //         include: {
    //           Professor: true,
    //         },
    //       },
    //     },
    //   });
    //   const result = await lectureRepository.getAll({ professorName: 'name' });
    //   expect(result).toBeDefined();
    //   expect(result).toEqual(expectResult);
    // });
  });
});
