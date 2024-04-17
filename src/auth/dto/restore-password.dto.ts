import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RestorePasswordDto {
  @ApiProperty({
    description: 'Password reset token.',
  })
  @IsString()
  readonly token: string;
}
