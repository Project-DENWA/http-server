import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'new user email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Incorrect value of mail field' })
  readonly newEmail: string;
}
