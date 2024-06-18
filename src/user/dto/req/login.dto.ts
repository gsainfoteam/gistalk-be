import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LoginType, loginEnum } from 'src/user/types/login.type';

export class LoginDto {
  @ApiProperty({
    example: 'code',
    description: 'idp code',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'web local flutter',
    description: 'idp type',
  })
  @IsString()
  @IsEnum(loginEnum)
  @IsOptional()
  type?: LoginType;
}
