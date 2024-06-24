import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { SortWorksType } from 'src/feed/types/sort-works.type';

export class FeedDto {
  @ApiProperty({
    example: 'RECENTLY',
    description: 'Sorting order of the feed',
    type: SortWorksType
  })
  @IsEnum(SortWorksType)
  readonly sort: SortWorksType;

  @ApiProperty({
    example: 1,
    description: 'Page number of the feed',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page in the feed',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly pageSize: number;
}
