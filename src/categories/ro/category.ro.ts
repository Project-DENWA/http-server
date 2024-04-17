import { ApiProperty } from "@nestjs/swagger";
import { CategoryModel } from "src/models/categories.model";

export class CategoryRo {
    @ApiProperty({
      example: 'e8c2a758-95bd-4c28-908f-c8f2b911de6f',
      description: 'Unique category ID',
    })
    readonly id: string;
  
    @ApiProperty({
      example: 'Backend',
      description: 'Category name',
    })
    readonly name: string;
  
    constructor(category: CategoryModel) {
      this.id = category.id;
      this.name = category.name;
    }
  }