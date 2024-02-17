import { ApiProperty } from '@nestjs/swagger';

export default class ResponseRo {
  @ApiProperty({
    description: 'The result of executing the request.',
    nullable: false,
  })
  readonly ok: boolean;

  @ApiProperty({
    description: 'A message with extra information.',
    nullable: true,
  })
  readonly message?: string;

  @ApiProperty({
    description: 'The result of the request execution.',
    nullable: true,
  })
  readonly result: any;
}
