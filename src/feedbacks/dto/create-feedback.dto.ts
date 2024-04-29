import { ApiProperty } from "@nestjs/swagger";

export class CreateFeedbackDto {
    @ApiProperty({
        example: '1',
        description: 'Work ID.',
    })
    readonly workId: string;

    @ApiProperty({ example: 'Typical description', description: 'Description of work', nullable: true, required: false })
    readonly description?: string | null;
}