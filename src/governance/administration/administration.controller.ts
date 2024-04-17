import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { JwtAdminGuard } from '../admins/guards/jwt-admin.guard';
import { RolesGuard } from '../admins/guards/role.guard';
import { Roles } from '../admins/decorators/roles.decorator';
import { Role } from '../admins/enums/role.enum';
import ResponseRo from 'src/common/ro/Response.ro';

@ApiTags('Administration')
@Controller('administration')
export class AdministrationController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiBearerAuth('admin-token')
  // @UseGuards(JwtAdminGuard, RolesGuard)
  // @Roles(Role.ADMINISTRATOR)
  // @ApiOperation({ summary: 'Get users only for administrators' })
  // @Get('/users')
  // async getUsers(): Promise<ResponseRo> {
  //   const users = await this.usersService.getAll();

  //   return {
  //     ok: true,
  //     result: users,
  //   };
  // }
}
