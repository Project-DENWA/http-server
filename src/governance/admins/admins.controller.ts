import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import ResponseRo from 'src/common/ro/Response.ro';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { JwtAdminGuard } from './guards/jwt-admin.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PublicAdminRo } from './ro/public-admin.ro';
import { AdminRequest } from './interfaces/admin-request.interface';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post('registration')
  async registrationAdmin(
    @Body() dto: CreateAdminDto,
    @Req() req: Request,
    @Ip() ip: string,
  ): Promise<ResponseRo> {
    return await this.adminsService.registrationAdmin(dto, req, ip);
  }

  @Post('login')
  async loginAdmin(
    @Body() dto: CreateAdminDto,
    @Req() req: Request,
    @Ip() ip: string,
  ): Promise<ResponseRo> {
    return await this.adminsService.loginAdmin(dto, req, ip);
  }

  @ApiBearerAuth('admin-token')
  @Post('/make-moderator/')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async makeModerator(
    @Body() dto: UpdateRoleDto,
    @Req() req: AdminRequest,
  ): Promise<ResponseRo> {
    const adminModel = new PublicAdminRo(
      await this.adminsService.updateRole(
        dto.adminId,
        Role.MODERATOR,
        req.admin.role,
      ),
    );

    return {
      ok: true,
      message: 'The moderator role has been accepted',
      result: adminModel,
    };
  }

  @ApiBearerAuth('admin-token')
  @Post('/make-administrator')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles(Role.SUPER)
  async makeAdmin(
    @Body() dto: UpdateRoleDto,
    @Req() req: AdminRequest,
  ): Promise<ResponseRo> {
    const adminModel = new PublicAdminRo(
      await this.adminsService.updateRole(
        dto.adminId,
        Role.ADMINISTRATOR,
        req.admin.role,
      ),
    );

    return {
      ok: true,
      message: 'The administrator role has been accepted',
      result: adminModel,
    };
  }

  @ApiBearerAuth('admin-token')
  @Post('/make-nobody')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async makeNobody(
    @Body() dto: UpdateRoleDto,
    @Req() req: AdminRequest,
  ): Promise<ResponseRo> {
    const adminModel = new PublicAdminRo(
      await this.adminsService.updateRole(
        dto.adminId,
        Role.DELETED,
        req.admin.role,
      ),
    );

    return {
      ok: true,
      message: 'The nobody role has been accepted',
      result: adminModel,
    };
  }

  @ApiBearerAuth('admin-token')
  @Get('/getAll')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles(Role.SUPER)
  async getAllAdmins(): Promise<ResponseRo> {
    return {
      ok: true,
      result: await this.adminsService.getAll(),
    };
  }
}
