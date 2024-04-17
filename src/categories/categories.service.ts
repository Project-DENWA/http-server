import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryModel } from 'src/models/categories.model';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryModel)
        private categoriesRepository: Repository<CategoryModel>,
    ) {}

    public async createCategory({ categoryName }: CreateCategoryDto ): Promise<CategoryModel> {
        const existingCategoryModel = await this.getCategory({ name: categoryName });
        if (existingCategoryModel) {
            throw new HttpException('Such a category has already been added', HttpStatus.CONFLICT);
        }

        const categoryModel = new CategoryModel();
        categoryModel.name = categoryName;
        await this.categoriesRepository.save(categoryModel);

        return categoryModel;
    }

    public async getCategory({
        id,
        name,
    }: {
        id?: string,
        name?: string,
    }): Promise<CategoryModel | null> {
        const categoryModel = await this.categoriesRepository.findOne({
            relations: {
                workCategories: true,
            },
            where: [
                { id },
                { name },
            ],
            select: {
                workCategories: { id: true, work: { id: true }, category: { id: true }, }
            },
        });

        return categoryModel;
    }

    public async getAll(): Promise<CategoryModel[] | null> {
        return await this.categoriesRepository.find({
            relations: {
                workCategories: true,
            },
            select: {
                workCategories: { id: true, work: { id: true }, category: { id: true }, }
            },
        });
    }
}
