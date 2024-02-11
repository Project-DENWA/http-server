import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({ example: 'Prplth', description: 'Username' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  readonly username: string;

  @ApiProperty({ example: 'e12ger43', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ example: '123456', description: '2FA code' })
  readonly tfaCode?: string;
}
