import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import ResponseRo from "src/common/ro/Response.ro";
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

  export class CategoriesRoModel extends ResponseRo {
    @ApiProperty({
      nullable: false,
      type: () => CategoryRo,
      isArray: true,
    })
    @Type(() => CategoryRo)
    readonly result: CategoryRo[];
  }

  export class CategoryExpRo {
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

    @ApiProperty({
      example: '2 years',
      description: 'Experience in this category',
    })
    exp: string;
  
    constructor(category: CategoryModel, exp: string) {
      this.id = category.id;
      this.name = category.name;
      this.exp =  exp;
    }
  }