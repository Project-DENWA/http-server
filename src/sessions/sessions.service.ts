import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SessionModel } from '../models/sessions.model';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionModel)
    private sessionRepository: Repository<SessionModel>,
  ) {}

  async createSession(dto: CreateSessionDto): Promise<SessionModel> {
    const session = new SessionModel();
    session.refreshToken = dto.refreshToken;
    session.ip = dto.ip;
    session.userAgent = dto.userAgent;
    session.lastActivity = new Date();
    session.user = dto.user;
    return await this.sessionRepository.save(session);
  }

  async getAllSessions({
    userId,
  }: {
    userId?: string;
  }): Promise<SessionModel[]> {
    const sessionsModel = await this.sessionRepository.find({
      where: [{ user: { id: userId } }],
    });

    return sessionsModel;
  }

  async getSession({
    id,
    refreshToken,
    ip,
    userAgent,
  }: {
    id?: string;
    refreshToken?: string;
    ip?: string;
    userAgent?: string;
  }): Promise<SessionModel | null> {
    const conditions: Record<string, any> = {};

    if (id) conditions.id = id;
    if (refreshToken) conditions.refreshToken = refreshToken;
    if (ip) conditions.ip = ip;
    if (userAgent) conditions.userAgent = userAgent;

    const sessionModel = await this.sessionRepository.findOne({
      relations: {
        user: true,
      },
      where: conditions,
      select: {
        user: { id: true },
      },
    });

    return sessionModel;
  }

  async updateLastActivity(id: string): Promise<void> {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    session.lastActivity = new Date();
    await this.sessionRepository.update({ id }, session);
  }

  async deleteOldSessions(): Promise<void> {
    try {
      const expirationPeriod = 30;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - expirationPeriod);
      const deletedCount = await this.sessionRepository
        .createQueryBuilder()
        .delete()
        .from(SessionModel)
        .where('lastActivity < :expirationDate', { expirationDate })
        .execute();

      console.log(`Deleted ${deletedCount.affected} old sessions.`);
    } catch (error) {
      console.error('Error deleting old sessions:', error);
    }
  }

  async deleteSession(id: string, userId: string): Promise<void> {
    const sessionModel = await this.sessionRepository.findOne({
      where: { user: { id: userId }, id },
    });
    if (!sessionModel) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    await this.sessionRepository.delete({ id, user: { id: userId } });
  }
}
