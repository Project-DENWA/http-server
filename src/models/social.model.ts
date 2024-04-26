import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'socials' })
export class SocialModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'https://example.com/',
    description: 'Website link',
  })
  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @ApiProperty({
    example: 'https://github.com',
    description: 'GitHub link',
  })
  @Column({ type: 'varchar', nullable: true })
  github: string | null;

  @ApiProperty({
    example: 'https://t.me',
    description: 'Telegram link',
  })
  @Column({ type: 'varchar', nullable: true })
  telegram: string | null;

  @ApiProperty({
    example: 'https://discord.gg',
    description: 'Discord link',
  })
  @Column({ type: 'varchar', nullable: true })
  discord: string | null;
}
