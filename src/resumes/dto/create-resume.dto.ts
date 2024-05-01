import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsObject, IsString } from "class-validator";
import { LanguageLevel } from "src/languages/enums/language-level.enum";
import { UpdateSocialDto } from "./update-social.dto";

export class CreateResumeDto {
    @ApiProperty({ description: 'Unique tag for resume', example: 'Eugener3' })
    tagname: string;

    @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
    })
    description: string | null;

    @ApiProperty({
        description: 'Category names of the resume',
        type: [String],
        example: ['Web Development', 'Graphic Design'],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    categoryNames: string[];

    @ApiProperty({
      description: 'Language objects of the resume',
      example: {
        name: 'Russian',
        level: LanguageLevel.BEGINNER,
      },
    })
    @IsObject()
    languages: {
      name: string,
      level: LanguageLevel,
    }

    @ApiProperty({
      example: UpdateSocialDto,
    })
    socials?: UpdateSocialDto;
}