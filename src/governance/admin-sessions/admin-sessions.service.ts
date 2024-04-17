import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminSessionDto } from './dto/create-admin-session.dto';
import { AdminModel } from '../models/admin.model';
import { AdminSessionModel } from '../models/admin-sessions.model';

@Injectable()
export class AdminSessionsService {
  constructor(
    @InjectRepository(AdminSessionModel)
    private adminSessionsRepository: Repository<AdminSessionModel>,
  ) {}

  async createSession(dto: CreateAdminSessionDto): Promise<void> {
    const adminSession = new AdminSessionModel();
    adminSession.refreshToken = dto.refreshToken;
    adminSession.ip = dto.ip;
    adminSession.userAgent = dto.userAgent;
    adminSession.lastActivity = new Date();
    adminSession.admin = dto.admin;
    await this.adminSessionsRepository.save(adminSession);
  }

  async getSessions(adminModel: AdminModel) {
    return await this.adminSessionsRepository.find({
      where: [{ admin: adminModel }],
    });
  }

  async deleteOldAdminSessions(): Promise<void> {
    try {
      const expirationPeriod = 30;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - expirationPeriod);
      const deletedCount = await this.adminSessionsRepository
        .createQueryBuilder()
        .delete()
        .from(AdminSessionModel)
        .where('lastActivity < :expirationDate', { expirationDate })
        .execute();

      console.log(`Deleted ${deletedCount.affected} old admin sessions.`);
    } catch (error) {
      console.error('Error deleting old admin sessions:', error);
    }
  }
}
