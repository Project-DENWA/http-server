import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'dmdrl', description: 'Admin username' })
  readonly login: string;

  @ApiProperty({ example: 'password', description: 'Admin password' })
  readonly password: string;
}
