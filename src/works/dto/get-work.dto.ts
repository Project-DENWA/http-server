import { ApiProperty } from "@nestjs/swagger";

export class GetWorkDto {
    @ApiProperty({
        example: '1',
        description: 'Work ID.',
    })
    readonly workId: string;
}