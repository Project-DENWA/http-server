import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT Token',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;

  @ApiProperty({ example: '192.168.0.1', description: 'User IP Address' })
  @IsString()
  @IsNotEmpty()
  readonly ip: string;

  @ApiProperty({ example: 'Mozilla/6.0 ...', description: 'User Agent' })
  @IsString()
  @IsNotEmpty()
  readonly userAgent: string;

  @ApiProperty({ example: '32', description: 'User id' })
  @IsNotEmpty()
  userId: string;
}
