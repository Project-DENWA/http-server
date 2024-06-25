import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { FeedDto } from "./feed.dto";
import { SortResumesType } from "../types/sort-resumes.type";

export class ResumesFeedDto extends FeedDto {
    @ApiProperty({
        example: SortResumesType.RECENTLY,
        description: 'Sorting order of the feed',
        type: SortResumesType
    })
    @IsEnum(SortResumesType)
    readonly sort: SortResumesType;

    @ApiProperty({
        description: 'Categories to filter',
        example: ['DevOps', 'Backend'],
        required: false,
        type: [String]
    })
    categories?: string[];

    @ApiProperty({
        description: 'Languages to filter',
        example: ['Russian', 'English'],
        required: false,
        type: [String]
    })
    languages?: string[];
}