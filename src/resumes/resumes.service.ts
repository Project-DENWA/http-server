import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeModel } from 'src/models/resumes.model';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { SocialModel } from 'src/models/social.model';
import { CategoriesService } from 'src/categories/categories.service';
import { ResumeCategoryModel } from 'src/models/resume-categories.model';
import { LanguagesService } from 'src/languages/languages.service';
import { ResumeLanguageModel } from 'src/models/resume-languages.model';

@Injectable()
export class ResumesService {
    constructor(
        @InjectRepository(ResumeModel)
        private resumesRepository: Repository<ResumeModel>,
        private readonly dataSource: DataSource,
        private readonly usersService: UsersService,
        private readonly categoriesService: CategoriesService,
        private readonly languagesService: LanguagesService,
    ) {}

    public async create(dto: CreateResumeDto, userId: string) {
        return await this.dataSource.transaction(async (manager) => {
            const userModel = await this.usersService.getUserOrThrow({ id: userId })
            const existingResumeModel = await this.getResume({ userId, tagname: dto.tagname })
            if (existingResumeModel)
                if (existingResumeModel.user.id == userId) {
                    throw new HttpException('You already have a resume', HttpStatus.CONFLICT)    
                } else {
                    throw new HttpException('A resume with the same tagname already exists', HttpStatus.CONFLICT)    
                }
                
            const resumeModel = new ResumeModel();
            resumeModel.tagname = dto.tagname;
            resumeModel.description = dto.description;
            resumeModel.user = userModel;

            const socialModel = new SocialModel();
            resumeModel.social = socialModel;
            if (dto.socials) {
                if (dto.socials.websiteURL) socialModel.website = dto.socials.websiteURL;
                if (dto.socials.github) socialModel.github = dto.socials.github;
                if (dto.socials.telegram) socialModel.telegram = dto.socials.telegram;
                if (dto.socials.discord) socialModel.discord = dto.socials.discord;
            }

            await manager.save(socialModel);
            await manager.save(resumeModel);
            
            for (const category of dto.categories) {
                const categoryModel = await this.categoriesService.getCategory({ name: category.name });
                if (!categoryModel)
                    throw new HttpException(`Category '${category.name}' not found`, HttpStatus.NOT_FOUND);
                const resumeCategoryModel = new ResumeCategoryModel();
                resumeCategoryModel.resume = resumeModel;
                resumeCategoryModel.category = categoryModel;
                resumeCategoryModel.exp = category.exp;
                await manager.save(resumeCategoryModel);
            }
            for (const language of dto.languages) {
                const languageModel = await this.languagesService.getLanguage({ name: language.name });
                if (!languageModel)
                    throw new HttpException(`Language '${language.name}' not found`, HttpStatus.NOT_FOUND);
                const resumeLanguageModel = new ResumeLanguageModel();
                resumeLanguageModel.resume = resumeModel;
                resumeLanguageModel.language = languageModel;
                resumeLanguageModel.level = language.level;
                await manager.save(resumeLanguageModel);
            }
    
            return resumeModel;
        })
    }

    public async getResume({
        id,
        userId,
        tagname,
    }: {
        id?: string;
        userId?: string;
        tagname?: string;
    }): Promise<ResumeModel> {
        const resumeModel = await this.resumesRepository.findOne({
            relations: {
                social: true,
                user: true,
                resumeCategories: true,
                resumeLanguages: true,
            },
            where: [
                { id },
                { user: { id: userId } },
                { tagname },
            ],
        });

        return resumeModel;
    }

    public async getResumeOrThrow({
        id,
        userId,
        tagname,
    }: {
        id?: string;
        userId?: string;
        tagname?: string;
    }): Promise<ResumeModel> {
        const resumeModel = await this.getResume({ id, userId, tagname })
        if (!resumeModel)
            throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
        return resumeModel;
    }
}
