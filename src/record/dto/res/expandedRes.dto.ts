import { ApiProperty } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import { Lecture, LectureSection, Professor } from '@prisma/client';

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

class LectureSectionResDto implements LectureSection {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lectureId: number;

  @ApiProperty()
  Lecture: LectureResDto;

  @ApiProperty()
  Professor: ProfessorResDto;
}

export class ExpandedRecordResDto extends RecordResDto {
  @ApiProperty()
  LectureSection: LectureSectionResDto;
}
