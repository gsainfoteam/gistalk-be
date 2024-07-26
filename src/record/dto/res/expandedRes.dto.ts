import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import { Lecture, Professor } from '@prisma/client';
import { ExpandedRecordType } from 'src/record/types/ExpandedRecord.type';

class LectureResDto implements Lecture {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class ProfessorResDto implements Professor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

class LectureSectionResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lectureId: number;

  @ApiProperty({
    type: [ProfessorResDto],
  })
  Professor: ProfessorResDto[];

  @ApiProperty({
    type: LectureResDto,
  })
  Lecture: LectureResDto;
}

class CountResDto {
  @ApiProperty()
  RecordLike: number;
}

export class ExpandedRecordResDto
  extends RecordResDto
  implements ExpandedRecordType
{
  @ApiProperty({
    type: () => LectureSectionResDto,
  })
  LectureSection: LectureSectionResDto;

  @ApiPropertyOptional({
    type: CountResDto,
  })
  _count?: CountResDto;
}
