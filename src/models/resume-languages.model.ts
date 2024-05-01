import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ResumeModel } from "./resumes.model";
import { LanguageModel } from "./languages.model";
import { LanguageLevel } from "src/languages/enums/language-level.enum";

@Entity({ name: 'resume_languages' })
export class ResumeLanguageModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        example: LanguageLevel.PRE_INTERMEDIATE,
        description: 'Status of the work (Examples: Beginner, Elementary, Pre-Intermediate, Upper-Intermediate, Advanced, Proficiency)',
    })
    @Column({
        type: 'enum',
        enum: LanguageLevel,
        default: LanguageLevel.PRE_INTERMEDIATE,
    })
    level: LanguageLevel;

    @ApiProperty({
        description: 'Resume',
    })
    @ManyToOne(() => ResumeModel, (resume) => resume.resumeLanguages, {
        eager: true,
    })
    @JoinColumn()
    resume: ResumeModel;

    @ApiProperty({
        description: 'Language',
    })
    @ManyToOne(() => LanguageModel, (language) => language.resumeLanguages, {
        eager: true,
    })
    @JoinColumn()
    language: LanguageModel;
}