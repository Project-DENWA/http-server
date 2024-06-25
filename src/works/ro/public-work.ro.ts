import { ApiProperty } from '@nestjs/swagger';
import { CategoryRo } from 'src/categories/ro/category.ro';
import { ImageModel } from 'src/models/images.model';
import { WorkModel } from 'src/models/works.model';
import { PublicUser } from 'src/users/ro/public-user.ro';
import { WorkStatus } from '../enums/work-status.enum';
import ResponseRo from 'src/common/ro/Response.ro';

export class PublicWork {
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

  @ApiProperty({ description: 'Work user', type: () => PublicUser })
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
  public views: number;

  @ApiProperty({
    type: () => WorkStatus,
    example: WorkStatus.OPEN,
    description: 'Status of the work',
  })
  public status: WorkStatus;

  @ApiProperty({
    type: () => [CategoryRo],
    description: 'List of work categories',
  })
  readonly categories: CategoryRo[];

  @ApiProperty({
    type: () => [ImageModel],
    description: 'List of work categories',
  })
  readonly images: ImageModel[];

  @ApiProperty({
    type: Number,
    description: 'Number of feedbacks'
  })
  readonly feedbacksAmount: number;

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
      verified: work.user.verified,
      meta: work.user.meta,
      avatar: work.user.avatar,
    };
    this.categories = work.workCategories?.map(category => new CategoryRo(category.category)) || [];
    this.images = work.images;
    this.feedbacksAmount =  work.feedbacks ? work.feedbacks.length : 0;
  }
}

export class PublicWorkRo extends ResponseRo {
    @ApiProperty({
      type: () => PublicWork,
      nullable: false,
    })
    readonly result: PublicWork;
}