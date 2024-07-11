import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Professor, LectureCode } from '@prisma/client';

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

class LectureCodeResDto implements LectureCode {
  @ApiProperty({
    example: '1',
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
        Professor: true;
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

  @ApiProperty()
  Professor: ProfessorResDto[];
}

export class ExpandedLectureResDto
  implements
    Prisma.LectureGetPayload<{
      include: {
        LectureCode: true;
        LectureSection: {
          include: {
            Professor: true;
          };
        };
      };
    }>
{
  @ApiProperty({
    example: 1,
    description: '강의 Id',
  })
  id: number;

  @ApiProperty({
    description: '강의명',
  })
  name: string;

  @ApiProperty({
    description: '강의 코드 정보',
    type: [LectureCodeResDto],
  })
  LectureCode: LectureCodeResDto[];

  @ApiProperty({
    description: '강의 section 정보',
    type: [LectureSectionResDto],
  })
  LectureSection: LectureSectionResDto[];
}
