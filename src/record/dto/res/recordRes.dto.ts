import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Record } from '@prisma/client';

export class RecordResDto implements Record {
  @ApiProperty()
  id: number;

  @ApiProperty()
  difficulty: number;

  @ApiProperty()
  skill: number;

  @ApiProperty()
  helpfulness: number;

  @ApiProperty()
  interest: number;

  @ApiProperty()
  load: number;

  @ApiProperty()
  generosity: number;

  @ApiProperty()
  review: string;

  @ApiProperty({
    enum: $Enums.Recommendation,
    enumName: 'Recommendation',
  })
  recommendation: $Enums.Recommendation;

  @ApiProperty({
    enum: $Enums.Semester,
    enumName: 'Semester',
  })
  semester: $Enums.Semester;

  @ApiProperty()
  year: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userUuid: string;

  @ApiProperty()
  sectionId: number;
}
