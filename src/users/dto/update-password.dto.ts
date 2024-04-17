import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { minNumbers } from '../decorators/min-numbers.decorator';
import { minLetters } from '../decorators/min-letters.decorator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'password123!',
    description: 'Current account password.',
  })
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @ApiProperty({
    example: 'password123!',
    description: 'New account password.',
  })
  @IsString({ message: 'The password field must be a string' })
  @Matches(/^[A-Za-z0-9 .,'!&]+$/, {
    message:
      'Password must contain only latin letters, number and special characters',
  })
  @MinLength(4)
  @minNumbers(1)
  @minLetters(1)
  readonly newPassword: string;
}
