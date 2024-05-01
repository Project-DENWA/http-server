import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageModel } from 'src/models/languages.model';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';

@Injectable()
export class LanguagesService {
    constructor(
        @InjectRepository(LanguageModel)
        private languagesRepository: Repository<LanguageModel>,
    ) {}

    public async create(
        dto: CreateLanguageDto
    ): Promise<LanguageModel> {
        const existingLanguageModel = await this.getLanguage({ name: dto.name });
        if (existingLanguageModel)
            throw new HttpException('Such a language has already been added', HttpStatus.CONFLICT);
        const languageModel = new LanguageModel();
        languageModel.name = dto.name;
        await this.languagesRepository.save(languageModel);

        return languageModel;
    }

    public async getLanguage({
        name,
    }: {
        name?: string;
    }): Promise<LanguageModel | null> {
        const languageModel = await this.languagesRepository.findOne({
            where: [
                {name},
            ],
        })

        return languageModel;
    }

    public async getLanguageOrThrow({
        name,
    }:{
        name?: string,
    }): Promise<LanguageModel> {
        const languageModel = await this.getLanguage({ name });
        if (!languageModel)
            throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
        
        return languageModel;
    }

    public async getAll(): Promise<LanguageModel[] | null> {
        return await this.languagesRepository.find();
    }
}
