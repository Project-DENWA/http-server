import { ApiProperty } from "@nestjs/swagger";
import { GetWorkDto } from "./get-work.dto";
import { IsUUID } from "class-validator";

export class WorkInProcessDto extends GetWorkDto{
    @ApiProperty({
        example: '1',
        description: 'Resume ID.',
    })
    @IsUUID()
    readonly resumeId: string;
}