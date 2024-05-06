import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ example: '123456', description: '2FA code.', required: false })
  @IsOptional()
  @IsString()
  readonly tfaCode?: string;
}
