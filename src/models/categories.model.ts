import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { WorkCategoryModel } from "./work-categories.model";

@Entity({ name: 'categories' })
export class CategoryModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'Backend',
    description: 'Category name',
  })
  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  
  @OneToMany(() => WorkCategoryModel, (workCategory) => workCategory.category)
  workCategories: WorkCategoryModel[];
}
