import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray } from "class-validator";
import { LanguageLevel } from "src/languages/enums/language-level.enum";

class SocialDto {
  @ApiProperty({
    example: 'https://',
    description: 'Website link',
    required: false,
  })
  readonly websiteURL?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Github link',
    required: false,
  })
  readonly github?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Telegram link',
    required: false,
  })
  readonly telegram?: string;

  @ApiProperty({
    example: 'https://',
    description: 'Discord link',
    required: false,
  })
  readonly discord?: string;
}

class ResumeLanguageDto {
  @ApiProperty({
    example: 'Russian',
    description: 'Language name',
  })
  name: string;

  @ApiProperty({
    example: LanguageLevel.PRE_INTERMEDIATE,
    description: 'Status of the work (Examples: Beginner, Elementary, Pre-Intermediate, Upper-Intermediate, Advanced, Proficiency)',
  })
  level: LanguageLevel;
}

class ResumeCategoriesDto {
  @ApiProperty({
    example: 'Backend',
    description: 'Category name',
  })
  name: string;

  @ApiProperty({
    description: 'Work experience',
    example: '2m',
  })
  exp: string;
}

export class CreateResumeDto {
    @ApiProperty({ description: 'Unique tag for resume', example: 'Eugener3' })
    tagname: string;

    @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
    })
    description: string | null;

    @ApiProperty({
        description: 'Categories of the resume',
        example: [ResumeCategoriesDto],
    })
    @IsArray()
    @ArrayNotEmpty()
    categories: ResumeCategoriesDto[];

    @ApiProperty({
      description: 'Language objects of the resume',
      example: [ResumeLanguageDto],
    })
    @IsArray()
    @ArrayNotEmpty()
    languages: ResumeLanguageDto[];

    @ApiProperty({
      example: SocialDto,
    })
    socials?: SocialDto;
}