import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthCompanyGuards implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.cookies['accesstoken'];

      const payLoad = await this.jwtService.verify(token);

      request.companyId = payLoad.companyId;

      return true;
    } catch (e) {
      throw new UnauthorizedException('Permission denied');
    }
  }
}
