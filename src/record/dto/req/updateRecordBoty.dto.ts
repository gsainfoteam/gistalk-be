import { ApiProperty } from '@nestjs/swagger';
import { Recommendation, Semester } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateRecordBodyDto {
  @ApiProperty({
    description: '강의의 난이도',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  difficulty?: number;

  @ApiProperty({
    description: '강의력',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  skill?: number;

  @ApiProperty({
    description: '유익함',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  helpfulness?: number;

  @ApiProperty({
    description: '흥미도',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  interest?: number;

  @ApiProperty({
    description: '과제량',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  load?: number;

  @ApiProperty({
    description: '성적기준의 엄격함',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @Max(5)
  @Min(1)
  @IsOptional()
  generosity?: number;

  @ApiProperty({
    description: '강의평',
    example: '좋아요',
    required: false,
  })
  @IsString()
  @IsOptional()
  review?: string;

  @ApiProperty({
    description: '추천여부',
    enumName: 'Recommendation',
    required: false,
  })
  @IsString()
  @IsEnum(Recommendation)
  @IsOptional()
  recommendation?: Recommendation;

  @ApiProperty({
    description: '학기',
    enumName: 'Semester',
    required: false,
  })
  @IsString()
  @IsEnum(Semester)
  @IsOptional()
  semester?: Semester;

  @ApiProperty({
    description: '년도',
    example: 2021,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @IsOptional()
  year?: number;
}
