import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { SearchEnum, SearchType } from 'src/record/types/search.type';
import { PagenationQueryDto } from './pagenationQuery.dto';
import { Transform } from 'class-transformer';

export class GetAllRecordQueryDto extends PagenationQueryDto {
  @ApiProperty({
    description: 'Search type',
    enum: SearchEnum,
  })
  @IsString()
  @IsIn(SearchEnum)
  type: SearchType;

  @ApiProperty({
    description: 'Lecture id',
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
  lectureId?: number;

  @ApiProperty({
    description: '강의 section id',
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
  sectionId?: number;

  @ApiProperty({
    description: 'professor id',
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
  professorId?: number;
}
