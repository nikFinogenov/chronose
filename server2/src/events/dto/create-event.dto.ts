import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'User identifier', example: 1 })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
