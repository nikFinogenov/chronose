import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateEventDto {
  @ApiProperty({ description: 'User identifier', example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
