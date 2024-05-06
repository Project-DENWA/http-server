import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import ResponseRo from 'src/common/ro/Response.ro';

export class TfaSecret {
  @ApiProperty({ description: 'Tfa secret for auth.' })
  readonly secret: string;

  @ApiProperty({ description: 'qrCodeUrl for auth.' })
  readonly qrCodeUrl: string;
}

export class TfaSecretRo extends ResponseRo {
  @ApiProperty({ nullable: false, type: () => TfaSecret })
  @Type(() => TfaSecret)
  readonly result?: TfaSecret;
}
