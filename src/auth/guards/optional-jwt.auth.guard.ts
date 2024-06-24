import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization?.split(' ');

    if (auth && auth[0] === 'Bearer' && auth[1]) {
      try {
        const user = this.jwtService.verify(auth[1]);
        request.user = user;
      } catch (e) {}
    }

    return true;
  }
}
