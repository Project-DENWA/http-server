import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import ResponseRo from "src/common/ro/Response.ro";
import { CommentModel } from "src/models/comments.model";
import { ResumeModel } from "src/models/resumes.model";
import { WorkModel } from "src/models/works.model";

export class CommentRo {
    @ApiProperty({
        description: 'Text of feedback',
        example: 'The work is amazingly done, kudos to the author!',
    })
    text: string;

    @ApiProperty({
        example: '4.5',
        description: 'Rating of resume',
    })
    rating: number;

    @ApiProperty({
        example: WorkModel,
        description: 'Work model',
    })
    @IsUUID()
    readonly workModel: WorkModel;

    @ApiProperty({
        example: ResumeModel,
        description: 'Resume model',
    })
    @IsUUID()
    readonly resumeModel: ResumeModel;

    constructor(commentModel: CommentModel) {
        this.rating = commentModel.rating;
        this.text = commentModel.text;
        this.workModel = commentModel.work;
        this.resumeModel = commentModel.resume;
    }
}

export class CommentRoModel extends ResponseRo {
    @ApiProperty({
        type: () => CommentRo,
        nullable: false,
    })
    readonly result: CommentRo;
}

export class CommentsRoModel extends ResponseRo {
    @ApiProperty({
        type: () => [CommentRo],
        nullable: false,
    })
    readonly result: CommentRo[];
}