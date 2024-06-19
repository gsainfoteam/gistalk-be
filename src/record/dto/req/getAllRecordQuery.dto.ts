import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { SearchEnum, SearchType } from 'src/record/types/search.type';
import { PagenationQueryDto } from './pagenationQuery.dto';

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
  @IsNumber()
  @IsInt()
  @IsOptional()
  lectureId?: number;

  @ApiProperty({
    description: 'Professor id',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsInt()
  @IsOptional()
  professorId?: number;
}
