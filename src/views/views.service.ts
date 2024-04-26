import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewsModel } from 'src/models/views.model';
import { Repository } from 'typeorm';

@Injectable()
export class ViewsService {
    constructor(
        @InjectRepository(ViewsModel)
        private viewsRepository: Repository<ViewsModel>,
      ) {}

    public async addView(
        userId: string,
        contentType: string,
        contentId: string,
      ): Promise<void> {
        const existingView = await this.viewsRepository.findOne({
          where: { userId, contentType, contentId },
        });
    
        const nowDate = new Date();
        if (!existingView) {
          const view = this.viewsRepository.create({
            userId,
            contentType,
            contentId,
          });
          await this.viewsRepository.save(view);
        } else {
          const timeDiff = nowDate.getTime() - existingView.viewedAt.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          if (hoursDiff <= 1) {
            throw new HttpException(
              'Less than an hour is viewing time',
              HttpStatus.FORBIDDEN,
            );
          }
          existingView.viewedAt = nowDate;
          await this.viewsRepository.save(existingView);
        }
      }

    async getViewedIds(userId: string, contentType: string): Promise<string[]> {
        const viewedCollections = await this.viewsRepository
            .createQueryBuilder('views')
            .select('views.contentId')
            .where('views.userId = :userId AND views.contentType = :contentType', {
            userId,
            contentType,
            })
            .getMany();

        return viewedCollections.map((view) => view.contentId);
    }
}
