import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class EvaluationQueryDto {
  @ApiProperty({
    example: 1,
    description: '강의 Id',
  })
  @IsNumber()
  @IsInt()
  lectureId: number;

  @ApiProperty({
    example: 1,
    description: '교수 Id',
  })
  @IsNumber()
  @IsInt()
  professorId: number;
}
