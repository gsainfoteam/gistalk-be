import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class PagenationQueryDto {
  @ApiProperty({
    description: '가져올 것의 개수',
    example: 1,
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
  take?: number;

  @ApiProperty({
    description: '가져올 것의 시작점',
    example: 10,
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
  offset?: number;
}
