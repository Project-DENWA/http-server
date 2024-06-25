import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import ResponseRo from "src/common/ro/Response.ro";
import { PublicResume } from "src/resumes/ro/public-resume.ro";

  
export class ResumesFeedRo extends ResponseRo {
    @ApiProperty({ nullable: false, type: () => [PublicResume] })
    @Type(() => PublicResume)
    readonly result: PublicResume[];
}