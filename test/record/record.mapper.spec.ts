import { Test } from '@nestjs/testing';
import { RecordMapper } from 'src/record/record.mapper';
import { ExpandedRecordType } from 'src/record/types/ExpandedRecord.type';

describe('RecordMapper', () => {
  let mapper: RecordMapper;

  beforeEach(async () => {
    const mockModule = await Test.createTestingModule({
      providers: [RecordMapper],
    }).compile();
    mapper = mockModule.get<RecordMapper>(RecordMapper);
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  describe('expandedRecordTypeToExpandedRecordResDto', () => {
    const now = new Date();
    const recordsWithoutRecordLike: ExpandedRecordType[] = [
      {
        id: 1,
        difficulty: 1,
        skill: 5,
        helpfulness: 4,
        interest: 4,
        load: 1,
        generosity: 5,
        review: 'review',
        recommendation: 'MAYBE',
        semester: 'FALL',
        year: 2022,
        createdAt: now,
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2022,
          semester: 'FALL',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2022,
              semester: 'FALL',
              professorId: 9,
              Professor: {
                id: 9,
                name: 'name',
              },
            },
          ],
        },
      },
    ];
    const recordsWithRecordLike: ExpandedRecordType[] = [
      {
        id: 1,
        difficulty: 1,
        skill: 5,
        helpfulness: 4,
        interest: 4,
        load: 1,
        generosity: 5,
        review: 'review',
        recommendation: 'MAYBE',
        semester: 'FALL',
        year: 2022,
        createdAt: now,
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2022,
          semester: 'FALL',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2022,
              semester: 'FALL',
              professorId: 9,
              Professor: {
                id: 9,
                name: 'name',
              },
            },
          ],
        },
        RecordLike: [
          {
            id: 1,
            createdAt: now,
            userUuid: 'uuid',
            deletedAt: null,
            recordId: 1,
          },
        ],
      },
    ];
    it('should return ExpandedRecordResDto without RecordLike', () => {
      const res = mapper.expandedRecordTypeToExpandedRecordResDto(
        recordsWithoutRecordLike[0],
      );
      expect(res).toEqual({
        id: 1,
        difficulty: 1,
        skill: 5,
        helpfulness: 4,
        interest: 4,
        load: 1,
        generosity: 5,
        review: 'review',
        recommendation: 'MAYBE',
        semester: 'FALL',
        year: 2022,
        createdAt: now,
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2022,
          semester: 'FALL',
          capacity: 0,
          fullCapacityTime: null,
          registrationCount: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          Professor: [
            {
              id: 9,
              name: 'name',
            },
          ],
        },
        isLiked: false,
      });
    });
    it('should return ExpandedRecordResDto with RecordLike', () => {
      const res = mapper.expandedRecordTypeToExpandedRecordResDto(
        recordsWithRecordLike[0],
      );
      expect(res).toEqual({
        id: 1,
        difficulty: 1,
        skill: 5,
        helpfulness: 4,
        interest: 4,
        load: 1,
        generosity: 5,
        review: 'review',
        recommendation: 'MAYBE',
        semester: 'FALL',
        year: 2022,
        createdAt: now,
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2022,
          semester: 'FALL',
          capacity: 0,
          fullCapacityTime: null,
          registrationCount: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          Professor: [
            {
              id: 9,
              name: 'name',
            },
          ],
        },
        isLiked: true,
      });
    });
  });
});
