import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class EvaluationQueryDto {
  @ApiProperty({
    example: 1,
    description: '강의 section id',
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  @IsNumber()
  @IsInt()
  sectionId: number;

  @ApiProperty({
    example: 1,
    description: '교수 id',
  })
  @Transform(({ value }) => {
    try {
      return parseInt(value);
    } catch {
      return value;
    }
  })
  @IsNumber()
  @IsInt()
  @IsOptional()
  professorId: number;
}
