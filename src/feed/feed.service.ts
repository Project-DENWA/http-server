import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkModel } from 'src/models/works.model';
import { WorkStatus } from 'src/works/enums/work-status.enum';
import { ViewsService } from 'src/views/views.service';
import { EntityType } from 'src/common/types/entity.enum';
import { SortWorksType } from './types/sort-works.type';
import { FeedDto } from 'src/common/dto/feed.dto';

@Injectable()
export class FeedService {
    constructor(
        private readonly viewsService: ViewsService,
    ) {}

    public async works(
        manager: EntityManager,
        dto: FeedDto,
        userId?: string,
      ): Promise<WorkModel[]> {
        const query = manager.createQueryBuilder(WorkModel, 'work')
            .leftJoinAndSelect('work.user', 'user')
            .leftJoinAndSelect('work.workCategories', 'workCategory')
            .leftJoinAndSelect('work.images', 'images') 
            .leftJoinAndSelect('workCategory.category', 'category')
            .leftJoinAndSelect('work.feedbacks', 'feedbacks');

        query.where('(work.status = :status)', {
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

        // СДЕЛАТЬ ВЫБОР КАТЕГОРИЙ, КОТОРЫЕ БЕРУТСЯ ИЗ ManyToMany
        // if (dto.area !== AreaType.UNKNOWN)
        //   query.andWhere('collection.area != :unknown', {
        //     unknown: AreaType.UNKNOWN,
        //   });
    
        // // СДЕЛАТЬ ЗАПРОС НА ВСЕ КАРТИНКИ ВОРКОВ
        // query.leftJoinAndSelect('collection.avatar', 'avatar');
        // query.andWhere('avatar.icon IS NOT NULL');
        // query.andWhere('avatar.cover IS NOT NULL');
    
        // query.andWhere('collection.area != :personal', {
        //   personal: AreaType.PERSONAL,
        // });
    
        // if (dto.area !== AreaType.ADULT)
        //   query.andWhere('collection.area != :adult', {
        //     adult: AreaType.ADULT,
        //   });
    
        // if (dto.area)
        //   query.andWhere('collection.area = :area', {
        //     area: dto.area,
        //   });

        const offset = (dto.page - 1) * dto.pageSize;
        query.offset(offset);
        query.limit(dto.pageSize);
        try {
            return await query.getMany();
          } catch (error) {
            throw new HttpException(
                'Error when getting a collection feed',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
    }
}
