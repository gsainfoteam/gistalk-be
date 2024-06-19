import { ApiProperty } from '@nestjs/swagger';

export class SearchLectureQueryDto {
  @ApiProperty()
  keyword: string;
}
