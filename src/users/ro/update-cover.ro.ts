import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import ResponseRo from 'src/common/ro/Response.ro';

class UpdateCoverResult {
  @ApiProperty({ description: 'New cover url.' })
  readonly url: string;
}

export class UpdateCoverRo extends ResponseRo {
  @ApiProperty({ nullable: false, type: () => UpdateCoverResult })
  @Type(() => UpdateCoverResult)
  readonly result: UpdateCoverResult;
}
