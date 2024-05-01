import { Body, Controller, Get, HttpException, Param, Post, UseGuards } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import ResponseRo from 'src/common/ro/Response.ro';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/governance/admins/guards/jwt-admin.guard';
import { RolesGuard } from 'src/governance/admins/guards/role.guard';
import { Roles } from 'src/governance/admins/decorators/roles.decorator';
import { Role } from 'src/governance/admins/enums/role.enum';

@ApiTags('Languages')
@Controller('languages')
export class LanguagesController {
    constructor(
        private languagesService: LanguagesService,
    ) {}

    @ApiOperation({ summary: 'Create a language' })
    @ApiBearerAuth('admin-token')
    @UseGuards(JwtAdminGuard, RolesGuard)
    @Roles(Role.ADMINISTRATOR)
    @Post('/create-language')
    async create(@Body() dto: CreateLanguageDto): Promise<ResponseRo> {
        const languageModel = await this.languagesService.create(dto);

        return {
            ok: true,
            message: 'Language has been created',
            result: languageModel,
        }
    }

    @ApiOperation({ summary: 'Get a language' })
    @Get('/get-language/:name')
    async getLanguage(@Param('name') name: string): Promise<ResponseRo> {
        const languageModel = await this.languagesService.getLanguageOrThrow({ name });

        return {
            ok: true,
            result: languageModel,
        }
    }

    @ApiOperation({ summary: 'Get all languages' })
    @Get('/get-all')
    async getAllLanguages(): Promise<ResponseRo> {
        return {
            ok: true,
            result: await this.languagesService.getAll(),
        }
    }
}
