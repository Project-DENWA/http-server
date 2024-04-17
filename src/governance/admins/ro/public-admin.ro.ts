import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { AdminModel } from 'src/governance/models/admin.model';

export class PublicAdminRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique admin ID',
  })
  readonly id: string;

  @ApiProperty({ example: 'dmdrl', description: 'Admin username' })
  public login: string;

  @ApiProperty({
    enum: Role,
    example: Role.DELETED,
    description: 'Mr.Nobody role',
  })
  public role: Role;

  constructor(admin: AdminModel) {
    this.id = admin.id;
    this.login = admin.login;
    this.role = admin.role;
  }
}
