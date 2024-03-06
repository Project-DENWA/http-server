import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModel } from 'src/models/tokens.model';

@Module({
  providers: [TokensService],
  imports: [
    TypeOrmModule.forFeature([
      TokenModel,
    ]),
  ],
  exports: [
    TokensService,
  ]
})
export class TokensModule {}
