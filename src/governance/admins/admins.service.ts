import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseRo from 'src/common/ro/Response.ro';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminSessionDto } from '../admin-sessions/dto/create-admin-session.dto';
import { AdminSessionsService } from '../admin-sessions/admin-sessions.service';
import { PublicAdminRo } from './ro/public-admin.ro';
import { Role } from './enums/role.enum';
import { AdminModel } from '../models/admin.model';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminModel)
    private adminsRepository: Repository<AdminModel>,
    private jwtService: JwtService,
    private adminSessionsService: AdminSessionsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createSuper();
  }

  private async createSuper(): Promise<void> {
    const adminModel = await this.getAdmin({
      role: Role.SUPER,
    });
    if (!adminModel) {
      const adminModel = new AdminModel();
      adminModel.login = process.env.POSTGRES_USER as string;
      const hashedPassword = await bcrypt.hash(
        process.env.POSTGRES_PASSWORD as string,
        10,
      );
      adminModel.password = hashedPassword;
      adminModel.role = Role.SUPER;
      await this.adminsRepository.save(adminModel);
      return;
    }

    if (adminModel.login != (process.env.POSTGRES_USER as string)) {
      adminModel.login = process.env.POSTGRES_USER as string;
    }
    const passwordEquals = await bcrypt.compare(
      process.env.POSTGRES_PASSWORD as string,
      adminModel.password,
    );
    if (!passwordEquals) {
      const hashedPassword = await bcrypt.hash(
        process.env.POSTGRES_PASSWORD as string,
        10,
      );
      adminModel.password = hashedPassword;
    }
    await this.adminsRepository.save(adminModel);
  }

  async registrationAdmin(
    dto: CreateAdminDto,
    req: Request,
    ip: string,
  ): Promise<ResponseRo> {
    const existingAdminModel = await this.getAdmin({
      login: dto.login,
    });
    if (existingAdminModel)
      throw new HttpException(
        'Such a admin already exists',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const adminModel = await this.create({
      login: dto.login,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(adminModel, req, ip);
    const publicAdmin = new PublicAdminRo(adminModel);

    return {
      ok: true,
      message: 'Admin has been registered',
      result: {
        tokens,
        adminModel: publicAdmin,
      },
    };
  }

  private async create(dto: CreateAdminDto) {
    const adminModel = new AdminModel();
    adminModel.login = dto.login;
    adminModel.password = dto.password;
    await this.adminsRepository.save(adminModel);

    return adminModel;
  }

  async getAdmin({
    login,
    id,
    role,
  }: {
    login?: string;
    id?: string;
    role?: Role;
  }): Promise<AdminModel | null> {
    const adminModel = await this.adminsRepository.findOne({
      relations: {
        sessions: true,
      },
      where: [{ id }, { login }, { role }],
    });
    return adminModel;
  }

  async getAll(): Promise<AdminModel[] | null> {
    return await this.adminsRepository.find();
  }

  private async generateTokens(
    adminModel: AdminModel,
    req: Request,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshTokenPayload = {
      adminId: adminModel.id,
    };

    const accessToken = this.createAccessToken(adminModel);
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    const createAdminSessionDto: CreateAdminSessionDto = {
      admin: adminModel,
      userAgent:
        (req.headers as { [key: string]: any })['user-agent'] || 'unknown',
      ip,
      refreshToken,
    };

    await this.adminSessionsService.createSession(createAdminSessionDto);

    return {
      accessToken,
      refreshToken,
    };
  }

  private createAccessToken(adminModel: AdminModel): string {
    const payload = {
      id: adminModel.id,
      role: adminModel.role,
    };

    return this.jwtService.sign(payload, { expiresIn: '30m' });
  }

  public async loginAdmin(
    dto: CreateAdminDto,
    req: Request,
    ip: string,
  ): Promise<ResponseRo> {
    const adminModel = await this.validateAdmin(dto);
    const tokens: object = await this.generateTokens(adminModel, req, ip);

    const publicAdmin = new PublicAdminRo(adminModel);
    return {
      ok: true,
      result: {
        tokens,
        adminModel: publicAdmin,
      },
    };
  }

  private async validateAdmin(dto: CreateAdminDto): Promise<AdminModel> {
    const adminModel = await this.getAdmin({
      login: dto.login,
    });

    if (!adminModel) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    const passwordEquals = await bcrypt.compare(
      dto.password,
      adminModel.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'The passwords do not match',
      });
    }

    return adminModel;
  }

  async updateRole(
    id: string,
    roleLevel: Role,
    adminRole: Role,
  ): Promise<AdminModel> {
    const adminModel = await this.getAdmin({ id });
    if (!adminModel)
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    if (adminRole <= adminModel.role) {
      throw new HttpException(
        'The admin is higher in rank',
        HttpStatus.FORBIDDEN,
      );
    }

    adminModel.role = roleLevel;
    await this.adminsRepository.update({ id }, { role: roleLevel });
    return adminModel;
  }
}
