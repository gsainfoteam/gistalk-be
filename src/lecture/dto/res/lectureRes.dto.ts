import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Professor } from '@prisma/client';

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

export class ExpandedLectureResDto
  implements
    Prisma.LectureGetPayload<{
      include: {
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
    example: 'A0001',
    description: '강의 코드',
  })
  lectureCode: string[];

  @ApiProperty({
    example: '운영체제',
    description: '강의 이름',
  })
  lectureName: string;
}
