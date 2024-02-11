import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'meta' })
export class MetaModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'fedyacrazy',
    description: 'Name',
  })
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'Description',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}
