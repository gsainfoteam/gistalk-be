import { ApiProperty } from '@nestjs/swagger';
import { Recommendation, Semester } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateRecordBodyDto {
  @ApiProperty({
    description: '강의의 난이도',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  difficulty: number;

  @ApiProperty({
    description: '강의력',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  skill: number;

  @ApiProperty({
    description: '유익함',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  helpfulness: number;

  @ApiProperty({
    description: '흥미도',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  interest: number;

  @ApiProperty({
    description: '과제량',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  load: number;

  @ApiProperty({
    description: '성적기준의 엄격함',
    example: 3,
  })
  @IsNumber()
  @IsInt()
  generosity: number;

  @ApiProperty({
    description: '강의평',
    example: '좋아요',
  })
  @IsString()
  review: string;

  @ApiProperty({
    description: '추천여부',
    enumName: 'Recommendation',
  })
  @IsString()
  @IsEnum(Recommendation)
  recommendation: Recommendation;

  @ApiProperty({
    description: '학기',
    enumName: 'Semester',
  })
  @IsString()
  @IsEnum(Semester)
  semester: Semester;

  @ApiProperty({
    description: '년도',
    example: 2021,
  })
  @IsNumber()
  @IsInt()
  year: number;

  @ApiProperty({
    description: '강의 id',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  lectureId: number;

  @ApiProperty({
    description: '교수님 id',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  professorId: number;
}
