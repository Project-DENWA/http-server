import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tfa' })
export class TfaModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: '2FA_Secret',
    description: 'Secret for Two-Factor Authentication',
  })
  @Column({ type: 'varchar', nullable: true, default: null })
  public secret: string | null;

  @ApiProperty({
    example: '53a74480-5316-4193-bb2f-14ba9a80b657',
    description: 'Token for 2FA confirmation',
  })
  @Column({ type: 'varchar', unique: true, nullable: true })
  token: string | null;
}
