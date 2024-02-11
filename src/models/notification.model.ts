import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class NotificationModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Receive notifications about news',
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  news: boolean;

  @ApiProperty({
    example: true,
    description: 'Receive notifications about messages',
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  messages: boolean;
}
