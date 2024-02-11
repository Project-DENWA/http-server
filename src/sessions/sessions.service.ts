import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionModel } from '../models/sessions.model';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionModel)
    private sessionRepository: Repository<SessionModel>,
    private jwtService: JwtService,
  ) {}

  async createSession(dto: CreateSessionDto): Promise<SessionModel> {
    const session = new SessionModel();
    session.refreshToken = dto.refreshToken;
    session.ip = dto.ip;
    session.userAgent = dto.userAgent;
    session.lastActivity = new Date();
    return await this.sessionRepository.save(session);
  }

  async getAllActiveSessions(): Promise<SessionModel[]> {
    return await this.sessionRepository.find();
  }

  async closeSessionById(id: string): Promise<void> {
    const session = await this.sessionRepository.findOneBy({ id });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    await this.sessionRepository.delete(session.id);
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<SessionModel | null> {
    if (!refreshToken) {
      throw new UnauthorizedException('No Authorization header');
    }
    if (refreshToken.startsWith('Bearer ')) {
      refreshToken = refreshToken.split(' ')[1];
    }

    if (!refreshToken) {
      throw new UnauthorizedException('No JWT provided');
    }
    return await this.sessionRepository.findOne({ where: { refreshToken } });
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

  async closeSessionByJWT(
    jwt: string,
  ): Promise<{ ok: boolean; message: string }> {
    const session = await this.findSessionByRefreshToken(jwt);
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    await this.sessionRepository.delete({ id: session.id });
    return {
      ok: true,
      message: 'The session has been deleted',
    };
  }

  async extractUserIdFromToken(token: string): Promise<string> {
    try {
      if (!token.startsWith('Bearer ')) {
        throw new Error('Invalid token format');
      }

      const jwt = token.split(' ')[1];

      const secretKey = process.env.PRIVATE_KEY as string;

      const decoded = this.jwtService.verify(jwt, { secret: secretKey });

      return decoded.id;
    } catch (error) {
      console.log(error);
      throw new Error('Error verifying token');
    }
  }

  async findSessionsByUserId(userId: string): Promise<SessionModel[]> {
    if (!userId) {
      throw new HttpException('User ID not found', HttpStatus.NOT_FOUND);
    }

    return [];
    /*return await this.sessionRepository.findAll({
      where: { userId },
    });*/
  }

  async logoutFromAllDevices(userId: string) {
    userId;
    /*await this.sessionRepository.destroy({ where: { userId: userId } });
    return {
      message: 'Sessions removed',
    };*/
  }

  async logoutBySessionId(sessionId: string, userId: string) {
    sessionId;
    userId;
    /*const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId: userId },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    await session.destroy();
    return {
      message: 'Session removed',
    };*/
  }
}
