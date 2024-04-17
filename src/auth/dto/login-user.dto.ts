import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'username',
    description: 'Account username or email.',
  })
  @IsString()
  readonly account: string;

  @ApiProperty({ example: 'password123!', description: 'User password.' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
