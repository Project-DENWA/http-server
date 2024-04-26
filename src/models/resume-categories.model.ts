import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ResumeModel } from "./resumes.model";
import { CategoryModel } from "./categories.model";

@Entity({ name: 'resume_categories' })
export class ResumeCategoryModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Resume',
  })
  @ManyToOne(() => ResumeModel, (resume) => resume.resumeCategories, {
    eager: true,
  })
  @JoinColumn()
  resume: ResumeModel;

  @ApiProperty({
    description: 'Category',
  })
  @ManyToOne(() => CategoryModel, (category) => category.resumeCategories, {
    eager: true,
  })
  @JoinColumn()
  category: CategoryModel;
}
