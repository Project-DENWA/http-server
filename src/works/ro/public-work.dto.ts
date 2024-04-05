import { ApiProperty } from '@nestjs/swagger';
import { WorkModel } from 'src/models/works.model';

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
    description: 'Unique user ID',
  })
  readonly id: string;


    @ApiProperty({
        example: '2023-12-11 23:08:02.949+07',
        description: 'User creation date',
    })
    readonly createdAt: string;

    @ApiProperty({ type: MetaRo, description: 'User meta' })
    readonly meta: MetaRo;

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

  constructor(work: WorkModel) {
    this.id = work.id;
    this.cost = work.cost;
    this.deadline = work.deadline;
    this.meta = work.meta;
    this.createdAt = work.created_at.getTime().toString();
  }
}
