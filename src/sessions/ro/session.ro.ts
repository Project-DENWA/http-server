import { ApiProperty } from '@nestjs/swagger';
import { SessionModel } from 'src/models/sessions.model';

export class SessionRo {
  @ApiProperty({
    example: '4a66a048-700b-40ea-bed6-781c37eb8732',
    description: 'Session unique ID',
  })
  id: string;

  @ApiProperty({ example: '1.1.1.1', description: 'User IP Address' })
  ip: string;

  @ApiProperty({ example: 'Mozilla/6.0', description: 'User Agent' })
  userAgent: string;

  @ApiProperty({ description: 'Time of last user activity' })
  lastActivity: Date;

  constructor(sessionModel: SessionModel) {
    this.id = sessionModel.id;
    this.ip = sessionModel.ip;
    this.userAgent = sessionModel.userAgent;
    this.lastActivity = sessionModel.lastActivity;
  }
}
