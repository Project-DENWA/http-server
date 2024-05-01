import { ApiProperty } from "@nestjs/swagger";
import { LanguageLevel } from "../enums/language-level.enum";

export class CreateLanguageDto {
    @ApiProperty({
        example: 'Russian',
        description: 'Language name',
    })
    name: string;

    // @ApiProperty({
    //     example: LanguageLevel.PRE_INTERMEDIATE,
    //     description: 'Status of the work (Examples: Beginner, Elementary, Pre-Intermediate, Upper-Intermediate, Advanced, Proficiency)',
    // })
    // level: LanguageLevel;
}