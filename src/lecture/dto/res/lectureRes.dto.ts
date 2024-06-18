import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class LectureResDto
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
    example: [
      {
        id: 1,
        name: '김교수',
      },
    ],
    description: '교수 정보',
  })
  LectureProfessor: ({ professor: { id: number; name: string } } & {
    id: number;
    lectureId: number;
    professorId: number;
  })[];

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
