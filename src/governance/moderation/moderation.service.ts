import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  // async updateStatus(dto: UpdateStatusDto): Promise<void> {
  //   const { entityType, entityId, status } = dto;
  //   let entityRepository: Repository<any>;

  //   switch (entityType) {
  //     case 'user':
  //       entityRepository = this.userRepository;
  //       break;
  //     case 'item':
  //       entityRepository = this.itemRepository;
  //       break;
  //     case 'collection':
  //       entityRepository = this.collectionRepository;
  //       break;
  //     default:
  //       throw new HttpException(
  //         'Entity type is invalid',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //   }

  //   const entityModel = await entityRepository.findOne({
  //     where: { id: entityId },
  //   });
  //   if (!entityModel) {
  //     throw new HttpException(`${entityType} not found`, HttpStatus.NOT_FOUND);
  //   }

  //   entityModel.status = status;
  //   await entityRepository.save(entityModel);
  // }
}
