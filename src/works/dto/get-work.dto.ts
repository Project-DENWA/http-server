import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GetWorkDto {
    @ApiProperty({
        example: '1',
        description: 'Work ID.',
    })
    @IsUUID()
    readonly workId: string;
}