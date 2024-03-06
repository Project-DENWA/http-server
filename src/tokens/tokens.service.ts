import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenModel } from 'src/models/tokens.model';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(TokenModel)
        private tokensRepository: Repository<TokenModel>,
      ) {}

    async getToken({
        userId,
        token,
      }: {
        userId?: string;
        token?: string;
      }): Promise<TokenModel | null> {
        const tokenModel = await this.tokensRepository.findOne({
          where: [{ userId }, { token }],
        });
    
        return tokenModel;
      }
    
      async createToken(userId: string): Promise<string> {
        let tokenModel = await this.getToken({ userId });
        if (tokenModel) {
          await this.tokensRepository.delete({
            id: tokenModel.id,
          });
        }
    
        const token = v4();
        tokenModel = new TokenModel();
        tokenModel.userId = userId;
        tokenModel.token = token;
    
        await this.tokensRepository.save(tokenModel);
    
        return token;
      }
    
      async removeToken(userId: string): Promise<void> {
        const tokenModel = await this.getToken({ userId });
        if (!tokenModel) {
          throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
        }
    
        await this.tokensRepository.delete({ userId });
      }
    
      async deleteOldTokens(): Promise<void> {
        try {
          const expirationPeriod = 1;
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() - expirationPeriod);
          const deletedCount = await this.tokensRepository
            .createQueryBuilder()
            .delete()
            .from(TokenModel)
            .where('created_at < :expirationDate', { expirationDate })
            .execute();
    
          console.log(`Deleted ${deletedCount.affected} old tokens.`);
        } catch (error) {
          console.error('Error deleting old tokens:', error);
        }
      }
}
