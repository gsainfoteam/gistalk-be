import { Test } from '@nestjs/testing';
import { LectureMapper } from 'src/lecture/lecture.mapper';
import { ExpandedLecture } from 'src/lecture/types/expandedLecture.type';

describe('LectureMapper', () => {
  let lectureMapper: LectureMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LectureMapper],
    }).compile();

    lectureMapper = moduleRef.get<LectureMapper>(LectureMapper);
  });

  it('to be defined', async () => {
    expect(lectureMapper).toBeDefined();
  });

  describe('expandedLectureToExpandedLectureResDto', () => {
    it('could convert ExpandedLecture to ExpandedLectureResDto', async () => {
      const expandedLecture: ExpandedLecture = {
        id: 1,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
            lectureId: 1,
          },
        ],
        LectureSection: [
          {
            id: 1,
            lectureId: 1,
            LectureSectionProfessor: [
              {
                lectureId: 1,
                sectionId: 1,
                professorId: 1,
                Professor: {
                  id: 1,
                  name: 'name',
                },
              },
              {
                lectureId: 1,
                sectionId: 2,
                professorId: 2,
                Professor: {
                  id: 2,
                  name: 'na-me',
                },
              },
            ],
          },
        ],
      };

      const result =
        lectureMapper.expandedLectureToExpandedLectureResDto(expandedLecture);

      expect(result).toEqual({
        id: 1,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
            lectureId: 1,
          },
        ],
        LectureSection: [
          {
            id: 1,
            lectureId: 1,
            Professor: [
              {
                id: 1,
                name: 'name',
              },
              {
                id: 2,
                name: 'na-me',
              },
            ],
          },
        ],
      });
    });
  });
});
