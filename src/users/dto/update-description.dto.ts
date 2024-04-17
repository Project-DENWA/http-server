import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDescriptionDto {
  @ApiProperty({
    example: 'A brief description of the user.',
    description: 'Description',
  })
  @IsString()
  @IsNotEmpty()
  readonly newDescription: string;
}
