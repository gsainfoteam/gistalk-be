import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchLectureQueryDto {
  @ApiProperty()
  @IsString()
  keyword: string;
}
