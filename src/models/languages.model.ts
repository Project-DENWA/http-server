import { ApiProperty } from "@nestjs/swagger";
import { LanguageLevel } from "src/languages/enums/language-level.enum";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ResumeLanguageModel } from "./resume-languages.model";

@Entity({ name: 'languages' })
export class LanguageModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        example: 'Russian',
        description: 'Language name',
    })
    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @OneToMany(() => ResumeLanguageModel, (resumeLanguage) => resumeLanguage.language)
    resumeLanguages: ResumeLanguageModel[];
}