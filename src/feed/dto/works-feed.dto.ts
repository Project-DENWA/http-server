import { ApiProperty } from "@nestjs/swagger";
import { FeedDto } from "./feed.dto";
import { SortWorksType } from "../types/sort-works.type";
import { IsEnum } from "class-validator";

export class WorksFeedDto extends FeedDto {
  @ApiProperty({
    example: SortWorksType.RECENTLY,
    description: 'Sorting order of the feed',
    type: SortWorksType
  })
  @IsEnum(SortWorksType)
  readonly sort: SortWorksType;

  @ApiProperty({
    description: 'Categories to filter',
    example: ['DevOps', 'Backend'],
    required: false,
    type: [String]
  })
  categories?: string[];
}