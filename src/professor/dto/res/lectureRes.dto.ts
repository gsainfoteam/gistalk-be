import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';

export class LectureResDto implements Lecture {
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
