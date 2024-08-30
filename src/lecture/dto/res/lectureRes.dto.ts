import { ApiProperty } from '@nestjs/swagger';
import { Professor, LectureCode, Semester, Prisma } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ExpandedLecture } from 'src/lecture/types/expandedLecture.type';

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

class LectureSectionResDto
  implements
    Prisma.LectureSectionGetPayload<{
      include: {
        LectureSectionProfessor: {
          include: {
            Professor: true;
          };
        };
      };
    }>
{
  @Exclude()
  LectureSectionProfessor: Prisma.LectureSectionProfessorGetPayload<{
    include: {
      Professor: true;
    };
  }>[];

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
  registrationCount: number | null;

  @ApiProperty({
    example: 1,
    description: '정원 다차는데 걸리는 시간',
  })
  fullCapacityTime: number | null;

  @ApiProperty({
    description: '교수 정보',
    type: [ProfessorResDto],
  })
  @Expose()
  get professor(): ProfessorResDto[] {
    return this.LectureSectionProfessor.map((professor) => ({
      id: professor.Professor.id,
      name: professor.Professor.name,
    }));
  }

  constructor(partial: Partial<LectureSectionResDto>) {
    Object.assign(this, partial);
  }
}

export class ExpandedLectureResDto implements ExpandedLecture {
  @Exclude()
  LectureCode: LectureCode[];

  @Exclude()
  LectureSection: Prisma.LectureSectionGetPayload<{
    include: {
      LectureSectionProfessor: {
        include: {
          Professor: true;
        };
      };
    };
  }>[];

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
    example: ['EC2202, MM2203'],
    description: '강의 코드',
  })
  @Expose()
  get lectureCode(): string[] {
    return this.LectureCode.map((code) => code.code);
  }

  @ApiProperty({
    description: '강의 section 정보',
    type: [LectureSectionResDto],
  })
  @Expose()
  get lectureSection(): LectureSectionResDto[] {
    return this.LectureSection.map(
      (section) => new LectureSectionResDto(section),
    );
  }

  constructor(partial: Partial<ExpandedLectureResDto>) {
    Object.assign(this, partial);
  }
}
