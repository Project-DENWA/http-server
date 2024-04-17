import { ApiProperty } from '@nestjs/swagger';
import ResponseRo from 'src/common/ro/Response.ro';

export class RefreshResult {
  @ApiProperty({ description: 'JWT access token.' })
  readonly accessToken: string;
}

export class RefreshRo extends ResponseRo {
  @ApiProperty({
    type: () => RefreshResult,
    nullable: false,
  })
  readonly result: RefreshResult;
}
