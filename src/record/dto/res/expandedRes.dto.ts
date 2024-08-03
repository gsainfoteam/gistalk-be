import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import {
  Lecture,
  LectureSection,
  Professor,
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
  sectionId: number;

  @ApiProperty()
  professorId: number;

  @ApiProperty()
  lectureId: number;

  @ApiProperty({
    type: ProfessorResDto,
  })
  Professor: ProfessorResDto;
}

class LectureSectionResDto implements LectureSection {
  @ApiProperty()
  id: number;

  @ApiProperty()
  lectureId: number;

  @ApiProperty({
    type: [LectureSectionProfessorResDto],
  })
  LectureSectionProfessor: LectureSectionProfessorResDto[];

  @ApiProperty({
    type: LectureResDto,
  })
  Lecture: LectureResDto;
}

class CountResDto {
  @ApiProperty()
  RecordLike: number;
}

export class ExpandedRecordResDto extends RecordResDto {
  @ApiProperty({
    type: () => LectureSectionResDto,
  })
  LectureSection: LectureSectionResDto;

  @ApiPropertyOptional()
  isLiked?: boolean;

  @ApiPropertyOptional({
    type: CountResDto,
  })
  _count?: CountResDto;
}
