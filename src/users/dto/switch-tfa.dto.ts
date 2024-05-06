import { ApiProperty } from '@nestjs/swagger';

export class SwitchTfaDto {
  @ApiProperty({ description: 'Tfa secret for switch.' })
  readonly secret: string;

  @ApiProperty({ example: '123456', description: '2FA code.' })
  readonly tfaCode: string;
}
