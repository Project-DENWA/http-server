import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'emails' })
export class EmailModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'example@email.com',
    description: 'User unique email',
  })
  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Verification of email confirmation',
  })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty({
    example: '53a74480-5316-4193-bb2f-14ba9a80b657',
    description: 'Token for email confirmation',
  })
  @Column({ type: 'varchar', unique: true, nullable: true })
  token: string | null;
}
