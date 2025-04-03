import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];

    if (!token) return false;

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
