import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, BaseEntity, PrimaryColumn } from 'typeorm';
import { UserModel } from './user.model';

@Entity({ name: 'sessions' })
export class SessionModel extends BaseEntity {
  @ApiProperty({
    example: '4a66a048-700b-40ea-bed6-781c37eb8732',
    description: 'Session unique ID',
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

  @ApiProperty({ example: '1.1.1.1', description: 'User IP Address' })
  @Column({ type: 'varchar' })
  ip: string;

  @ApiProperty({ example: 'Mozilla/6.0', description: 'User Agent' })
  @Column({ type: 'varchar' })
  userAgent: string;

  @ApiProperty({ description: 'Time of last user activity' })
  @Column({ type: 'timestamp' })
  lastActivity: Date;

  @ManyToOne(() => UserModel, (user) => user.sessions)
  user: UserModel;
}
