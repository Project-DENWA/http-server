import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import ResponseRo from 'src/common/ro/Response.ro';

class UpdateAvatarResult {
  @ApiProperty({ description: 'New avatar url.' })
  readonly url: string;
}

export class UpdateAvatarRo extends ResponseRo {
  @ApiProperty({ nullable: false, type: () => UpdateAvatarResult })
  @Type(() => UpdateAvatarResult)
  readonly result: UpdateAvatarResult;
}
