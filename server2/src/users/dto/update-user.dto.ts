import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User login', example: 'john_doe_updated', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  login?: string;
}
