import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { AdminModel } from 'src/governance/models/admin.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>(
      'roles',
      context.getHandler(),
    );
    if (requiredRole === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin: AdminModel = request.admin;

    if (!admin) {
      throw new UnauthorizedException();
    }

    return admin.role >= requiredRole;
  }
}
