import { ApiProperty } from "@nestjs/swagger";
import { CategoryRo } from "src/categories/ro/category.ro";
import { CommentModel } from "src/models/comments.model";
import { FeedbackModel } from "src/models/feedbacks.model";
import { ImageModel } from "src/models/images.model";
import { WorkModel } from "src/models/works.model";
import { PublicUser } from "src/users/ro/public-user.ro";
import { WorkStatus } from "../enums/work-status.enum";
import ResponseRo from "src/common/ro/Response.ro";

export class PrivateWork {
    @ApiProperty({
      example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
      description: 'Unique work ID',
    })
    readonly id: string;
  
    @ApiProperty({
      example: 'Art',
      description: 'Name',
    })
    public name: string;
  
    @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
    })
    public description: string | null;
  
    @ApiProperty({
        example: '2023-12-11 23:08:02.949+07',
        description: 'Work creation date',
    })
    readonly createdAt: string;
  
    @ApiProperty({ description: 'Work user' })
    readonly user: PublicUser;
  
    @ApiProperty({
        description: "Cost of the project",
        example: '150000'
    })
    public cost: number;
  
    @ApiProperty({
        description: 'Project deadline',
        example: '2024-12-31',
    })
    public deadline: Date;
  
    @ApiProperty({ example: '100', description: 'Number of views' })
    views: number;
  
    @ApiProperty({
        type: WorkStatus,
        example: WorkStatus.OPEN,
        description: 'Status of the work',
    })
    public status: WorkStatus;
  
    @ApiProperty({
      type: [CategoryRo],
      description: 'List of work categories',
    })
    readonly categories: CategoryRo[];
  
    @ApiProperty({
      type: [ImageModel],
      description: 'List of work categories',
    })
    readonly images: ImageModel[];

    @ApiProperty({
        type: [FeedbackModel],
        description: 'List of feedbacks',
    })
    feedbacks: FeedbackModel[];

    @ApiProperty({
        type: CommentModel,
        description: 'A comment on the work done',
    })
    public comment: CommentModel;
  
    constructor(work: WorkModel) {
      this.id = work.id;
      this.name = work.name;
      this.description = work.description;
      this.cost = work.cost;
      this.deadline = work.deadline;
      this.views = work.views;
      this.status = work.status;
      this.createdAt = work.created_at.getTime().toString();
      this.user = {
        id: work.user.id,
        fullname: work.user.fullname,
        bio: work.user.bio,
        email: work.user.email,
        meta: work.user.meta,
        avatar: work.user.avatar,
      };
      this.categories = work.workCategories?.map(category => new CategoryRo(category.category)) || [];
      this.images = work.images;
      this.feedbacks = work.feedbacks;
      this.comment = work.comment;
    }
  }

  export class PrivateWorkRo extends ResponseRo {
    @ApiProperty({
      type: () => PrivateWork,
      nullable: false,
    })
    readonly result: PrivateWork;
}
