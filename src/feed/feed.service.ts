import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkModel } from 'src/models/works.model';
import { WorkStatus } from 'src/works/enums/work-status.enum';
import { ViewsService } from 'src/views/views.service';
import { EntityType } from 'src/common/types/entity.enum';
import { SortWorksType } from './types/sort-works.type';
import { WorksFeedDto } from 'src/feed/dto/works-feed.dto';
import { UsersFeedDto } from './dto/users-feed.dto';
import { UserModel } from 'src/models/user.model';
import { ResumeModel } from 'src/models/resumes.model';
import { ResumeStatus } from 'src/resumes/enums/resume-status.enum';
import { ResumesFeedDto } from './dto/resumes-feed.dto';
import { SortResumesType } from './types/sort-resumes.type';

@Injectable()
export class FeedService {
    constructor(
        private readonly viewsService: ViewsService,
    ) {}

    public async works(
        manager: EntityManager,
        dto: WorksFeedDto,
        userId?: string,
      ): Promise<WorkModel[]> {
        const query = manager.createQueryBuilder(WorkModel, 'work')
            .leftJoinAndSelect('work.user', 'user')
            .leftJoinAndSelect('work.workCategories', 'workCategory')
            .leftJoinAndSelect('work.images', 'images') 
            .leftJoinAndSelect('workCategory.category', 'category')
            .leftJoinAndSelect('work.feedbacks', 'feedbacks')
            .where('(work.status = :status)', {
                status: WorkStatus.OPEN,
            });

        if (userId) {
            const viewedIds = await this.viewsService.getViewedIds(
                userId,
                EntityType.WORK,
            );
            if (viewedIds.length > 0) {
                query.orderBy(
                  `CASE WHEN work.id IN (:...viewedIds) THEN 1 ELSE 0 END`,
                  'ASC',
                );
            }
            if (viewedIds.length > 0) {
                query.setParameter('viewedIds', viewedIds);
            }
        }

        if (dto.sort === SortWorksType.RELEVANCE) {
            query.addOrderBy('work.views', 'DESC');
        } else if (dto.sort === SortWorksType.OWN) {
            query.where('work.user.id = :userId', {
                userId
            });
            query.addOrderBy('work.created_at', 'DESC');
        } else if (dto.sort === SortWorksType.RECENTLY) {
            query.addOrderBy('work.created_at', 'DESC');
        }
        
        if (dto.categories && typeof dto.categories === 'string') {
            dto.categories = [dto.categories];
          }
        if (dto.categories && dto.categories.length > 0) {
            query.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('work.id')
                    .from(WorkModel, 'work')
                    .leftJoin('work.workCategories', 'workCategory')
                    .leftJoin('workCategory.category', 'category')
                    .where('category.name IN (:...categories)', { categories: dto.categories })
                    .getQuery();
                return 'work.id IN ' + subQuery;
            });
        }


        const offset = (dto.page - 1) * dto.pageSize;
        query.offset(offset);
        query.limit(dto.pageSize);
        try {
            return await query.getMany();
          } catch (error) {
            console.log(error)
            throw new HttpException(
                `Error when getting a work's feed`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
    }

    public async users(
        manager: EntityManager,
        dto: UsersFeedDto,
      ): Promise<UserModel[]> {
        const query = manager.createQueryBuilder(UserModel, 'user')
            .leftJoinAndSelect('user.avatar', 'avatar')
            .leftJoinAndSelect('user.meta', 'meta')    
            .leftJoinAndSelect('user.email', 'email')    

        if (dto.verified) {
            query.where('(user.verified = :status)', {
                status: dto.verified,
            });
        }

        const offset = (dto.page - 1) * dto.pageSize;
        query.offset(offset);
        query.limit(dto.pageSize);
        try {
            return await query.getMany();
          } catch (error) {
            console.log(error)
            throw new HttpException(
                `Error when getting a user's feed`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
    }

    public async resumes(
        manager: EntityManager,
        dto: ResumesFeedDto,
      ): Promise<ResumeModel[]> {
        const query = manager.createQueryBuilder(ResumeModel, 'resume')
        .leftJoinAndSelect('resume.user', 'user')
        .leftJoinAndSelect('resume.resumeCategories', 'resumeCategory')
        .leftJoinAndSelect('resumeCategory.category', 'category')
        .leftJoinAndSelect('resume.resumeLanguages', 'resumeLanguage')
        .leftJoinAndSelect('resumeLanguage.language', 'language')
        .where('(resume.status = :status)', {
            status: ResumeStatus.WORKING,
        });

        if (dto.sort === SortResumesType.RELEVANCE) {
            query.addOrderBy('resume.rating', 'DESC');
        } else if (dto.sort === SortResumesType.RECENTLY) {
            query.addOrderBy('resume.created_at', 'DESC');
        }

        if (dto.categories && typeof dto.categories === 'string') {
            dto.categories = [dto.categories];
          }
        if (dto.categories && dto.categories.length > 0) {
            query.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('resume.id')
                    .from(ResumeModel, 'resume')
                    .leftJoin('resume.resumeCategories', 'resumeCategory')
                    .leftJoin('resumeCategory.category', 'category')
                    .where('category.name IN (:...categories)', { categories: dto.categories })
                    .getQuery();
                return 'resume.id IN ' + subQuery;
            });
        }

        if (dto.languages && typeof dto.languages === 'string') {
            dto.languages = [dto.languages];
          }
        if (dto.languages && dto.languages.length > 0) {
            query.andWhere(qb => {
                const subQuery = qb.subQuery()
                .select('resume.id')
                .from(ResumeModel, 'resume')
                .leftJoin('resume.resumeLanguages', 'resumeLanguage')
                .leftJoin('resumeLanguage.language', 'language')
                .where('language.name IN (:...languages)', { languages: dto.languages })
                .getQuery();
                return 'resume.id IN ' + subQuery;
            });
        }
        
        
        const offset = (dto.page - 1) * dto.pageSize;
        query.offset(offset);
        query.limit(dto.pageSize);
        try {
            return await query.getMany();
        } catch (error) {
            console.log(error)
            throw new HttpException(
                `Error when getting a resume's feed`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}