import { ApiProperty } from "@nestjs/swagger";
import { LanguageModel } from "src/models/languages.model";
import { LanguageLevel } from "../enums/language-level.enum";

export class LanguageRo {
    @ApiProperty({
      example: 'e8c2a758-95bd-4c28-908f-c8f2b911de6f',
      description: 'Unique language ID',
    })
    readonly id: string;
  
    @ApiProperty({
      example: 'Russan',
      description: 'Language name',
    })
    readonly name: string;
  
    constructor(language: LanguageModel) {
      this.id = language.id;
      this.name = language.name;
    }
  }

  export class LanguageLevelRo {
    @ApiProperty({
        example: 'e8c2a758-95bd-4c28-908f-c8f2b911de6f',
        description: 'Unique language ID',
    })
    readonly id: string;
    
    @ApiProperty({
        example: 'Russan',
        description: 'Language name',
    })
    readonly name: string;

    @ApiProperty({
        example: LanguageLevel.PRE_INTERMEDIATE,
        description: 'Status of the work (Examples: Beginner, Elementary, Pre-Intermediate, Upper-Intermediate, Advanced, Proficiency)',
    })
    level: LanguageLevel;
  
    constructor(language: LanguageModel, level: LanguageLevel) {
      this.id = language.id;
      this.name = language.name;
      this.level = level;
    }
  }