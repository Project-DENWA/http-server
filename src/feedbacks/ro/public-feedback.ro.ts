import { ApiProperty } from "@nestjs/swagger";
import { FeedbackStatus } from "../enums/feedback-status.enum";
import { WorkModel } from "src/models/works.model";
import { ResumeModel } from "src/models/resumes.model";
import { FeedbackModel } from "src/models/feedbacks.model";

export class PublicFeedbackRo {
    @ApiProperty({
      example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
      description: 'Unique feedback ID',
    })
    readonly id: string;
  
    @ApiProperty({
        example: 'Feedback description.',
        description: 'Hello, I specialize in building DB architectures and have a lot of experience in it.',
    })
    description: string | null;

    @ApiProperty({
        example: FeedbackStatus.UNCONFIRMED,
        description: 'Status of the resume (Examples: UNCONFIRMED, CONFIRMED, CANCELED)',
    })
    public status: string;

    public created_at: Date;

    @ApiProperty({
        description: 'Work',
    })
    work: WorkModel;

    @ApiProperty({
        description: 'Resume',
    })
    resume: ResumeModel;
  
    constructor(feedback: FeedbackModel) {
        this.id = feedback.id;
        this.description = feedback.description;
        this.status = feedback.status;
        this.created_at = feedback.created_at;
        this.work = feedback.work;
        this.resume = feedback.resume;
    }
}