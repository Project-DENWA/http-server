import { ApiProperty } from '@nestjs/swagger';
import { CategoryRo } from 'src/categories/ro/category.ro';
import { WorkModel } from 'src/models/works.model';
import { PublicUser } from 'src/users/ro/public-user.ro';

class MetaRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique meta ID',
  })
  readonly id: string;

  @ApiProperty({
    example: 'vitalik',
    description: 'Name',
  })
  readonly name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'Description',
  })
  readonly description: string | null;
}

export class PublicWorkRo {
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

  @ApiProperty({ type: MetaRo, description: 'Work meta' })
  readonly meta: MetaRo;

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
    example: 'closed',
    description: 'Status of the work',
  })
  public status: string;

  @ApiProperty({
    type: [CategoryRo],
    description: 'List of work categories',
  })
  readonly categories: CategoryRo[];

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
  }
}
