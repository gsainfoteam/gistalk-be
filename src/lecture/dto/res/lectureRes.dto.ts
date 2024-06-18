import { ApiProperty } from '@nestjs/swagger';
import { LectureCode, Prisma, Professor } from '@prisma/client';

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

class LectureProfessorResDto
  implements
    Prisma.LectureProfessorGetPayload<{
      include: {
        professor: true;
      };
    }>
{
  @ApiProperty({
    example: '1',
    description: '강의 Id',
  })
  lectureId: number;

  @ApiProperty({
    example: 1,
    description: '교수 Id',
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
    example: 'A0001',
    description: '강의 코드',
  })
  code: string;

  @ApiProperty({
    example: '1',
    description: '강의 Id',
  })
  lectureId: number;
}

export class ExpandedLectureResDto
  implements
    Prisma.LectureGetPayload<{
      include: {
        LectureCode: true;
        LectureProfessor: {
          include: {
            professor: true;
          };
        };
      };
    }>
{
  @ApiProperty({
    description: '교수 정보',
    type: [LectureProfessorResDto],
  })
  LectureProfessor: LectureProfessorResDto[];

  @ApiProperty({
    example: 1,
    description: '강의 Id',
  })
  id: number;

  @ApiProperty({
    description: '강의 코드',
    type: [LectureCodeResDto],
  })
  LectureCode: LectureCodeResDto[];

  @ApiProperty({
    example: '운영체제',
    description: '강의 이름',
  })
  lectureName: string;
}
