import { ApiProperty } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import {
  Lecture,
  Professor,
  LectureSection,
  LectureSectionProfessor,
} from '@prisma/client';

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

class LectureSectionProfessorResDto implements LectureSectionProfessor {
  @ApiProperty()
  professor: ProfessorResDto;
}

class LectureSectionResDto implements LectureSectionProfessor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lecture: LectureResDto;

  @ApiProperty()
  lectureSectionProfessor?: LectureSectionProfessorResDto;
}

export class ExpandedRecordResDto extends RecordResDto {
  @ApiProperty()
  lectureSection: LectureSectionResDto;
}
