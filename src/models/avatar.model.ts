import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'avatars' })
export class AvatarModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Icon URL',
  })
  @Column({ type: 'varchar', nullable: true })
  icon: string | null;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Cover image URL',
  })
  @Column({ type: 'varchar', nullable: true })
  cover: string | null;
}
