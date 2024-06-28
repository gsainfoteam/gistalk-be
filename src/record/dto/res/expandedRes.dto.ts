import { ApiProperty } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import { Lecture, Professor } from '@prisma/client';

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

class LectureProfessorResDto {
  @ApiProperty()
  lecture: LectureResDto;

  @ApiProperty()
  professor: ProfessorResDto;
}

export class ExpandedRecordResDto extends RecordResDto {
  @ApiProperty()
  lectureProfessor: LectureProfessorResDto;
}
