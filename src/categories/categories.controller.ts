import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/governance/admins/guards/jwt-admin.guard';
import { RolesGuard } from 'src/governance/admins/guards/role.guard';
import { Roles } from 'src/governance/admins/decorators/roles.decorator';
import { Role } from 'src/governance/admins/enums/role.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import ResponseRo from 'src/common/ro/Response.ro';
import { CategoriesRoModel, CategoryRo } from './ro/category.ro';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService,
    ) {}

    @ApiOperation({ summary: 'Create a category' })
    @ApiBearerAuth('admin-token')
    @UseGuards(JwtAdminGuard, RolesGuard)
    @Roles(Role.ADMINISTRATOR)
    @Post('/create-category')
    async createCategory(@Body() dto: CreateCategoryDto): Promise<ResponseRo> {
        await this.categoriesService.createCategory(dto);
        return {
            ok: true,
            message: 'The category has been successfuly added',
        }
    }

    @ApiOperation({ summary: 'Get a category' })
    @Get('/get-category/:name')
    async getCategory(@Param('name') categoryName: string): Promise<ResponseRo> {
        const categoryModel = await this.categoriesService.getCategory({ name: categoryName });
        if (!categoryModel) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return {
            ok: true,
            result: categoryModel,
        }
    }

    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        type: CategoriesRoModel,
    })
    @Get('/get-all')
    async getAllCategories(): Promise<CategoriesRoModel> {
        const result = await this.categoriesService.getAll();
        const categories: CategoryRo[] = result.map(category => new CategoryRo(category));
        return {
            ok: true,
            result: categories,
        }
    }
}
