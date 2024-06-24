import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import ResponseRo from "src/common/ro/Response.ro";
import { PublicWork } from "src/works/ro/public-work.ro";

// export class WorksFeedRo extends {
//     @ApiPropertyOptional({ description: 'Page key for pagination' })
//     readonly pageKey?: string;
  
//     @ApiProperty({
//       nullable: false,
//       type: () => [PublicWork],
//       isArray: true,
//     })
//     @Type(() => PublicWork)
//     readonly result: readonly PublicWork[];
//   }

export class WorksFeedRo extends ResponseRo {
  @ApiProperty({
    nullable: false,
    type: () => PublicWork,
    isArray: true,
  })
  @Type(() => PublicWork)
  readonly result: PublicWork[];
}

// export class CollectionsFeedRo {
//   readonly pageKey?: string | undefined;

//   @ApiProperty({
//     nullable: false,
//     type: () => MetadataCollection,
//     isArray: true,
//   })
//   @Type(() => MetadataCollection)
//   readonly result: readonly MetadataCollection[];
// }