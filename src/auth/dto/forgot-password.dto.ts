import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'example@email.com',
    description: 'Account email address',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({ example: 'username', description: 'Account username' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  readonly username: string;

  @ApiProperty({ example: '123456', description: '2FA code.' })
  @IsOptional()
  @IsString()
  readonly tfaCode?: string;
}
