import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAllQueryDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  professorName?: string;
}
