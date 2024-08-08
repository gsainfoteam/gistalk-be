import { ApiProperty } from '@nestjs/swagger';
import {
  Prisma,
  Professor,
  LectureCode,
  LectureSection,
  Semester,
} from '@prisma/client';

class ProfessorResDto implements Professor {
  @ApiProperty({
    example: 1,
    description: '교수 Id',
  })
  id: number;

  @ApiProperty({
    example: '김교수',
    description: '교수 이름',
  })
  name: string;
}

class LectureCodeResDto implements LectureCode {
  @ApiProperty({
    example: '1',
    description: '강의코드',
  })
  code: string;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;
}

class LectureSectionResDto implements LectureSection {
  @ApiProperty({
    example: 1,
    description: '강의 section id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;

  @ApiProperty({
    example: 2024,
    description: '강의 년도',
  })
  year: number;

  @ApiProperty({
    example: 'FALL',
    description: '강의 학기',
  })
  semester: Semester;

  @ApiProperty({
    example: 1,
    description: '수강 정원',
  })
  capacity: number;

  @ApiProperty({
    example: 1,
    description: '수강 신청 인원수',
  })
  registrationCount: number;

  @ApiProperty({
    example: 1,
    description: '정원 다차는데 걸리는 시간',
  })
  fullCapacityTime: number;

  @ApiProperty({
    description: '교수 정보',
    type: [ProfessorResDto],
  })
  Professor: ProfessorResDto[];
}

export class ExpandedLectureResDto
  implements
    Prisma.LectureGetPayload<{
      include: {
        LectureCode: true;
        LectureSection: true;
      };
    }>
{
  @ApiProperty({
    example: 1,
    description: '강의 Id',
  })
  id: number;

  @ApiProperty({
    description: '강의명',
  })
  name: string;

  @ApiProperty({
    description: '강의 코드 정보',
    type: [LectureCodeResDto],
  })
  LectureCode: LectureCodeResDto[];

  @ApiProperty({
    description: '강의 section 정보',
    type: [LectureSectionResDto],
  })
  LectureSection: LectureSectionResDto[];
}
