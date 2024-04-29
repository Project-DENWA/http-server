import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { SocialModel } from "./social.model";
import { UserModel } from "./user.model";
import { ResumeCategoryModel } from "./resume-categories.model";
import { ResumeStatus } from "src/resumes/enums/resume-status.enum";
import { FeedbackModel } from "./feedbacks.model";

@Entity({ name: 'resumes' })
export class ResumeModel extends BaseEntity {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique resume ID',
  })
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  public id: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'Description',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ApiProperty({
    example: true,
    description: 'Verification of resume',
  })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty({
    example: '4.34',
    description: 'Rating of resume',
  })
  @Column({ type: 'float', default: 0 })
  rating: number;

  @ApiProperty({
    example: 'OPEN',
    description: 'Status of the resume (Examples: WORKING, BANNED)',
  })
  @Column({
      type: 'enum',
      enum: ResumeStatus,
      default: ResumeStatus.WORKING,
  })
  public status: string;

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

  @OneToOne(() => SocialModel)
  @JoinColumn()
  public social: SocialModel;

  @OneToOne(() => UserModel, user => user.resume)
  @JoinColumn()
  public user: UserModel;

  @OneToMany(() => ResumeCategoryModel, (resumeCategory) => resumeCategory.resume)
  resumeCategories: ResumeCategoryModel[];

  @OneToMany(() => FeedbackModel, (feedback) => feedback.work)
  feedback: FeedbackModel[];

//   @OneToMany(() => ComplaintModel, (complaint) => complaint.user)
//   @JoinColumn()
//   public complaints: ComplaintModel[];
}
