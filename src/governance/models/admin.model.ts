import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/governance/admins/enums/role.enum';
import { AdminSessionModel } from './admin-sessions.model';

@Entity({ name: 'admins' })
export class AdminModel extends BaseEntity {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Unique admin ID',
  })
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  public id: string;

  @ApiProperty({ example: 'dmdrl', description: 'Admin username' })
  @Column({ type: 'varchar', unique: true })
  public login: string;

  @ApiProperty({
    example: '$2a$10$Ejs8y61M9PpW5nX.ghC9oe',
    description: 'Admin hashed password',
  })
  @Column({ type: 'varchar' })
  public password: string;

  @ApiProperty({
    enum: Role,
    example: Role.DELETED,
    description: 'Mr.Nobody role',
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.DELETED,
  })
  public role: Role;

  @OneToMany(() => AdminSessionModel, (session) => session.admin)
  @JoinColumn()
  public sessions: AdminSessionModel[];
}
