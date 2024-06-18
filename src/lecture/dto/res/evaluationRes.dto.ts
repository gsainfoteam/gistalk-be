import { ApiProperty } from '@nestjs/swagger';

export class EvaluationResDto {
  @ApiProperty({
    example: 5,
    description: '난이도',
  })
  difficulty: number | null;

  @ApiProperty({
    example: 5,
    description: '강의력',
  })
  skill: number | null;

  @ApiProperty({
    example: 5,
    description: '도움이 되는 정도',
  })
  helpfulness: number | null;

  @ApiProperty({
    example: 5,
    description: '흥미도',
  })
  interest: number | null;

  @ApiProperty({
    example: 5,
    description: '과제량',
  })
  load: number | null;

  @ApiProperty({
    example: 5,
    description: '성적이 후한 정도',
  })
  generosity: number | null;
}
