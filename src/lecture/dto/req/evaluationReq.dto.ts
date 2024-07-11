import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class EvaluationQueryDto {
  @ApiProperty({
    example: 1,
    description: '강의 Id',
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
  lectureId: number;

  @ApiProperty({
    example: 1,
    description: '강의 section Id',
    required: false,
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
  sectionId?: number;
}
