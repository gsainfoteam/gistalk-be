import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordResDto } from './recordRes.dto';
import { Lecture, LectureSection, Professor, Semester } from '@prisma/client';

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
  year: number;

  @ApiProperty()
  semester: Semester;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  registrationCount: number;

  @ApiProperty()
  fullCapacityTime: number;

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
