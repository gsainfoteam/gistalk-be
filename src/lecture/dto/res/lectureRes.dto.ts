import { ApiProperty } from '@nestjs/swagger';
import { LectureCode, Prisma, Professor, LectureSection } from '@prisma/client';

class LectureResDto implements Lecture {
  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  id: number;
  @ApiProperty({
    example: '운영체제',
    description: '강의명',
  })
  name: string;
}

class ProfessorResDto implements Professor {
  @ApiProperty({
    example: 1,
    description: '교수 Id',
  })
  id: number;

  @ApiProperty({
    example: '김교수',
    description: '교수 이름',
  })
  name: string;
}

class LectureSectionProfessorResDto
  implements
    Prisma.LectureSectionProfessorGetPayload<{
      include: {
        professor: true;
      };
    }>
{
  @ApiProperty({
    example: '1',
    description: '강의 section id',
  })
  sectionId: number;

  @ApiProperty({
    example: 1,
    description: '교수 id',
  })
  professorId: number;

  @ApiProperty({
    description: '강의 교수 Id',
    type: ProfessorResDto,
  })
  professor: ProfessorResDto;
}

class LectureCodeResDto implements LectureCode {
  @ApiProperty({
    example: 'GS2301',
    description: '강의코드',
  })
  code: string;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;
}

class LectureSectionResDto
  implements
    Prisma.LectureSectionGetPayload<{
      include: {
        LectureSectionProfessor: true;
      };
    }>
{
  @ApiProperty({
    example: 1,
    description: '강의 section id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;

  @ApiProperty({
    description: '강의 section 교수 정보',
    type: [LectureSectionProfessorResDto],
  })
  lectureSectionProfessor?: LectureSectionProfessorResDto;
}

export class ExpandedLectureResDto
  implements
    Prisma.LectureGetPayload<{
      include: {
        LectureCode: true;
        LectureSection: {
          include: {
            LectureSectionProfessor: {
              include: {
                professor: true;
              };
            };
          };
        };
      };
    }>
{
  @ApiProperty({
    example: 1,
    description: '강의 section id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;

  @ApiProperty({
    description: '강의 코드 정보',
    type: [LectureCodeResDto],
  })
  lecture: LectureCodeResDto[];

  @ApiProperty({
    description: '강의 section 정보',
    type: [LectureSectionResDto],
  })
  lectureSection: LectureSectionResDto[];
}
