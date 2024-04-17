import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { WorkModel } from "./works.model";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryModel } from "./categories.model";

@Entity({ name: 'work_categories' })
export class WorkCategoryModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Work',
  })
  @ManyToOne(() => WorkModel, (work) => work.workCategories, {
    eager: true,
  })
  @JoinColumn()
  work: WorkModel;

  @ApiProperty({
    description: 'Category',
  })
  @ManyToOne(() => CategoryModel, (category) => category.workCategories, {
    eager: true,
  })
  @JoinColumn()
  category: CategoryModel;
}
