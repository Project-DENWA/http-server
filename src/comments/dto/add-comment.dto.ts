import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, Max, Min } from "class-validator";

export class AddCommentDto {
    @ApiProperty({
        description: 'Text of feedback',
        example: 'The work is amazingly done, kudos to the author!',
    })
    text: string;

    @ApiProperty({
        example: '4.5',
        description: 'Rating of resume',
    })
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        example: '1',
        description: 'Work ID.',
    })
    @IsUUID()
    readonly workId: string;
}