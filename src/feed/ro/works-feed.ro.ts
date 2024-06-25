import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import ResponseRo from "src/common/ro/Response.ro";
import { PublicWork } from "src/works/ro/public-work.ro";

export class WorksFeedRo extends ResponseRo {
  @ApiProperty({
    nullable: false,
    type: () => PublicWork,
    isArray: true,
  })
  @Type(() => PublicWork)
  readonly result: PublicWork[];
}