import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../admins/guards/role.guard';
import { Role } from '../admins/enums/role.enum';
import { Roles } from '../admins/decorators/roles.decorator';
import { ModerationService } from './moderation.service';
import ResponseRo from 'src/common/ro/Response.ro';
import { JwtAdminGuard } from '../admins/guards/jwt-admin.guard';

@ApiTags('Moderation')
@Controller('moderation')
export class ModerationController {
  constructor(
    private readonly moderationService: ModerationService,
  ) {}

  // @ApiBearerAuth('admin-token')
  // @UseGuards(JwtAdminGuard, RolesGuard)
  // @Roles(Role.MODERATOR)
  // @Patch('/entity-status')
  // async updateStatus(@Body() dto: UpdateStatusDto): Promise<ResponseRo> {
  //   await this.moderationService.updateStatus(dto);

  //   return {
  //     ok: true,
  //     message: 'Status has been updated',
  //     result: null,
  //   };
  // }

  // @ApiBearerAuth('admin-token')
  // @UseGuards(JwtAdminGuard, RolesGuard)
  // @Roles(Role.MODERATOR)
  // @ApiOperation({ summary: 'Updating a complaint by id' })
  // @Patch('complaints/:id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateComplaintDto: UpdateComplaintDto,
  // ) {
  //   return this.complaintsService.update(id, updateComplaintDto);
  // }

  // @ApiBearerAuth('admin-token')
  // @UseGuards(JwtAdminGuard, RolesGuard)
  // @Roles(Role.MODERATOR)
  // @ApiOperation({ summary: 'Deleting a complaint by id' })
  // @Delete('/complaints/:id')
  // async remove(@Param('id') id: string) {
  //   return this.complaintsService.delete(id);
  // }

  // @ApiBearerAuth('admin-token')
  // @UseGuards(JwtAdminGuard, RolesGuard)
  // @Roles(Role.MODERATOR)
  // @Get('/complaints')
  // async getComplaints(): Promise<ResponseRo> {
  //   const complaints = await this.complaintsService.findAll();

  //   return {
  //     ok: true,
  //     result: complaints,
  //   };
  // }
}
