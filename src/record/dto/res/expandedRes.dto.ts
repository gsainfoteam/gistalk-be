import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Lecture,
  Prisma,
  Professor,
  Recommendation,
  Semester,
} from '@prisma/client';
import { ExpandedRecordType } from 'src/record/types/ExpandedRecord.type';
import { Exclude, Expose } from 'class-transformer';

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

class LectureSectionResDto
  implements
    Prisma.LectureSectionGetPayload<{
      include: {
        Lecture: true;
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

  @Exclude()
  Lecture: Lecture;

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
    description: '강의 정보',
    type: LectureResDto,
  })
  @Expose()
  get lecture(): LectureResDto {
    return this.Lecture;
  }

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

export class ExpandedRecordResDto implements ExpandedRecordType {
  @Exclude()
  LectureSection: Prisma.LectureSectionGetPayload<{
    include: {
      Lecture: true;
      LectureSectionProfessor: {
        include: {
          Professor: true;
        };
      };
    };
  }>;

  @Exclude()
  RecordLike:
    | {
        id: number;
        createdAt: Date;
        deletedAt: Date | null;
        userUuid: string;
        recordId: number;
      }[]
    | undefined;

  @Exclude()
  _count?: { RecordLike: number } | undefined;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '난이도',
  })
  difficulty: number;

  @ApiProperty({
    example: 1,
    description: '유익함',
  })
  skill: number;

  @ApiProperty({
    example: 1,
    description: '친절함',
  })
  helpfulness: number;

  @ApiProperty({
    example: 1,
    description: '흥미도',
  })
  interest: number;

  @ApiProperty({
    example: 1,
    description: '과제량',
  })
  load: number;

  @ApiProperty({
    example: 1,
    description: '성적 기준',
  })
  generosity: number;

  @ApiProperty({
    example: '좋아요',
    description: '강의 후기',
  })
  review: string;

  @ApiProperty({
    example: '추천',
    description: '추천 여부',
    enum: Recommendation,
  })
  recommendation: Recommendation;

  @ApiProperty({
    example: 'FALL',
    description: '학기',
    enum: Semester,
  })
  semester: Semester;

  @ApiProperty({
    example: 2024,
    description: '년도',
  })
  year: number;

  @ApiProperty({
    example: new Date(),
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: 1,
    description: '강의 id',
  })
  lectureId: number;

  @ApiProperty({
    example: 1,
    description: '강의 section id',
  })
  sectionId: number;

  @ApiProperty({
    description: '유저 uuid',
  })
  userUuid: string;

  @ApiProperty({
    description: '강의 정보',
    type: LectureSectionResDto,
  })
  @Expose()
  get lectureSection(): LectureSectionResDto {
    return new LectureSectionResDto(this.LectureSection);
  }

  @ApiPropertyOptional({
    example: true,
    description: '좋아요 여부',
  })
  @Expose()
  get liked(): boolean {
    return this.RecordLike ? this.RecordLike.length > 0 : false;
  }

  @ApiProperty({
    example: 1,
    description: '좋아요 수',
  })
  @Expose()
  get likeCount(): number {
    return this._count?.RecordLike || 0;
  }

  constructor(partial: Partial<ExpandedRecordResDto>) {
    Object.assign(this, partial);
  }
}
