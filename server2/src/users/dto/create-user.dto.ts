import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User login', example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  login: string;
}
