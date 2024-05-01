import { ApiProperty } from "@nestjs/swagger";
import { LanguageLevel } from "../enums/language-level.enum";

export class CreateLanguageDto {
    @ApiProperty({
        example: 'Russian',
        description: 'Language name',
    })
    name: string;
}