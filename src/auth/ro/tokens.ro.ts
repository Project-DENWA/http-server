import { ApiProperty } from '@nestjs/swagger';

export class TokensRo {
  @ApiProperty({
    description: 'JWT access token.',
  })
  readonly accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token.',
  })
  readonly refreshToken: string;
}
