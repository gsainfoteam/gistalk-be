import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  professorName?: string;
}
