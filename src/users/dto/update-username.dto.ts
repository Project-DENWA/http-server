import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUsernameDto {
  @ApiProperty({ example: 'Fedya', description: 'new username' })
  @IsString()
  @IsNotEmpty()
  readonly newUsername: string;
}
