import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class FeedDto {
  @ApiProperty({
    example: 'relevant',
    description: 'Sorting order of the feed',
    required: false,
  })
  readonly sort: string | null;

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
