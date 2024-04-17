import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { AdminModel } from './admin.model';

@Entity({ name: 'admin_sessions' })
export class AdminSessionModel extends BaseEntity {
  @ApiProperty({
    example: '4a66a048-700b-40ea-bed6-781c37eb8732',
    description: 'Admin session unique ID',
  })
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT Token',
  })
  @Column({ type: 'varchar' })
  refreshToken: string;

  @ApiProperty({ example: '1.1.1.1', description: 'Admin IP Address' })
  @Column({ type: 'varchar' })
  ip: string;

  @ApiProperty({ example: 'Mozilla/6.0', description: 'User Agent' })
  @Column({ type: 'varchar' })
  userAgent: string;

  @ApiProperty({ description: 'Time of last admin activity' })
  @Column({ type: 'timestamp' })
  lastActivity: Date;

  @ManyToOne(() => AdminModel, (admin) => admin.sessions)
  @JoinColumn({ name: 'adminId' })
  admin: AdminModel;
}
