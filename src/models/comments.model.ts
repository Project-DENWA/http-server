import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { WorkModel } from "./works.model";
import { ResumeModel } from "./resumes.model";

@Entity({ name: 'comments' })
export class CommentModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        description: 'Text of feedback',
        example: 'The work is amazingly done, kudos to the author!',
    })
    @Column({ type: 'varchar' })
    text: string;

    @ApiProperty({
        example: '4.34',
        description: 'Rating of resume',
      })
    @Column({ type: 'float' })
    rating: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @OneToOne(() => WorkModel, work => work.comment)
    @JoinColumn()
    public work: WorkModel;

    @ManyToOne(() => ResumeModel, (resume) => resume.comments, {
        eager: true,
    })
    @JoinColumn()
    resume: ResumeModel;
}