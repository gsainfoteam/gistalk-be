import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class BookMarkQueryDto {
  @ApiProperty({
    example: 1,
    description: '강의 id',
    required: true,
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  lectureId: number;

  @ApiProperty({
    example: 1,
    description: '분반 id',
    required: true,
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  sectionId: number;
}
