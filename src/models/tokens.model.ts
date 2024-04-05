import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  Index,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'tokens' })
export class TokenModel {
  @ApiProperty({
    description: 'Unique ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Column()
  @Index()
  userId: string;

  @ApiProperty({
    example: '53a74480-5316-4193-bb2f-14ba9a80b657',
    description: '24-hour token',
  })
  @Column({ type: 'varchar', unique: true })
  @Index()
  token: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}