import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({ name: 'views' })
export class ViewsModel {
  @ApiProperty({
    description: 'The unique identifier of the content view record',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'The unique identifier of the user who viewed the content',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Column()
  @Index()
  userId: string;

  @ApiProperty({
    description: 'The type of the viewed content (e.g., "work", "user")',
    example: 'work',
  })
  @Column()
  @Index()
  contentType: string;

  @ApiProperty({
    description: 'The unique identifier of the viewed content',
    example: '1f2f1ee-8c54-4b01-90e6-d701748f0c50',
  })
  @Column()
  @Index()
  contentId: string;

  @ApiProperty({
    description: 'The datetime when the content was viewed',
    example: '2023-01-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn()
  viewedAt: Date;
}