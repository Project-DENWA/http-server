import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { WorkModel } from "./works.model";
import { ResumeModel } from "./resumes.model";
import { FeedbackStatus } from "src/feedbacks/enums/feedback-status.enum";

@Entity({ name: 'feedbacks' })
export class FeedbackModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        example: 'Feedback description.',
        description: 'Hello, I specialize in building DB architectures and have a lot of experience in it.',
    })
    @Column({ type: 'varchar', nullable: true })
    description: string | null;

    @ApiProperty({
        example: FeedbackStatus.UNCONFIRMED,
        description: 'Status of the resume (Examples: UNCONFIRMED, CONFIRMED, CANCELED)',
    })
    @Column({
        type: 'enum',
        enum: FeedbackStatus,
        default: FeedbackStatus.UNCONFIRMED,
    })
    public status: FeedbackStatus;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @ApiProperty({
        description: 'Work',
    })
    @ManyToOne(() => WorkModel, (work) => work.feedback, {
        eager: true,
    })
    @JoinColumn()
    work: WorkModel;

    @ApiProperty({
        description: 'Resume',
    })
    @ManyToOne(() => ResumeModel, (resume) => resume.feedback, {
        eager: true,
    })
    @JoinColumn()
    resume: ResumeModel;
}