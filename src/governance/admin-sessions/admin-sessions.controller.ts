import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAdminGuard } from '../admins/guards/jwt-admin.guard';
import { AdminRequest } from '../admins/interfaces/admin-request.interface';
import { AdminSessionsService } from './admin-sessions.service';
import { AdminsService } from '../admins/admins.service';
import { AdminSessionModel } from '../models/admin-sessions.model';

@ApiTags('Admin sessions')
@Controller('admin-sessions')
export class AdminSessionsController {
  constructor(
    private adminSessionsService: AdminSessionsService,
    private adminsService: AdminsService,
  ) {}

  @ApiBearerAuth('admin-token')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({ summary: 'Get active admin sessions' })
  @ApiOkResponse({
    description: 'All active admin sessions',
    type: [AdminSessionModel],
  })
  @Get('/')
  async getSessionByJwt(@Req() req: AdminRequest) {
    const adminModel = await this.adminsService.getAdmin({ id: req.admin.id });
    if (!adminModel)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

    return this.adminSessionsService.getSessions(adminModel);
  }
}
