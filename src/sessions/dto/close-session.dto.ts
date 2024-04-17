import { ApiProperty } from '@nestjs/swagger';

export class CloseSessionDto {
  @ApiProperty({
    example: '4a66a048-700b-40ea-bed6-781c37eb8732',
    description: 'Session unique ID',
  })
  id: string;
}
