import { ApiProperty } from '@nestjs/swagger';
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

export class ExpandedRecordResDto
  extends RecordResDto
  implements ExpandedRecordType
{
  LectureSection: {
    Lecture: LectureResDto;
    Professor: ProfessorResDto[];
  } & { id: number; lectureId: number };
}
