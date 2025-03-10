import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthUsersGuards implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.cookies['usertoken'];

      const payLoad = await this.jwtService.verify(token);

      request.userId = payLoad.userId;

      return true;
    } catch (e) {
      throw new UnauthorizedException('Permission denied');
    }
  }
}
