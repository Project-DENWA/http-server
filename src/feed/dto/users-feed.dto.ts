import { ApiProperty } from "@nestjs/swagger";
import { FeedDto } from "src/feed/dto/feed.dto";

export class UsersFeedDto extends FeedDto {
    @ApiProperty({
        description: 'Filter verified users',
        example: true,
        required: false,
        type: Boolean,
      })
      verified?: boolean;
  }