import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { Semester } from '@prisma/client';

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
  @IsNumber()
  lectureId: number;

  @ApiProperty({
    example: 2024,
    description: '수강 년도',
    required: true,
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 'FALL',
    description: '수강 학기',
    required: true,
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  @IsEnum(Semester)
  semester: Semester;

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
  @IsNumber()
  sectionId: number;
}
