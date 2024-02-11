import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';
import { MetaModel } from './meta.model';
import { EmailModel } from './email.model';
import { TfaModel } from './tfa.model';
import { AvatarModel } from './avatar.model';
import { NotificationModel } from './notification.model';

@Entity({ name: 'users' })
export class UserModel extends BaseEntity {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique user ID',
  })
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  public id: string;

  @ApiProperty({ example: 'Fedor Batut', description: 'Full name' })
  @Column({ type: 'varchar' })
  public fullname: string;

  @ApiProperty({
    example: '$2a$05$LBNalJS.eyXbKgWiZ2uHyl/F16m2L3X',
    description: 'User hashed password',
  })
  @Column({ type: 'varchar' })
  public password: string;

  @ApiProperty({
    example: true,
    description: 'Verification of good person',
  })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToOne(() => MetaModel)
  @JoinColumn()
  public meta: MetaModel;

  @OneToOne(() => EmailModel)
  @JoinColumn()
  public email: EmailModel;

  @OneToOne(() => TfaModel)
  @JoinColumn()
  public tfa: TfaModel;

  @OneToOne(() => AvatarModel)
  @JoinColumn()
  public avatar: AvatarModel;

  @OneToOne(() => NotificationModel)
  @JoinColumn()
  public notification: NotificationModel;

//   @OneToMany(() => SessionModel, (session) => session.user)
//   @JoinColumn()
//   public sessions: SessionModel[];

//   @OneToMany(() => ComplaintModel, (complaint) => complaint.user)
//   @JoinColumn()
//   public complaints: ComplaintModel[];
}
