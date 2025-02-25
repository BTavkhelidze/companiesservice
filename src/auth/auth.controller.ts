import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpCompanyDto } from './dto/signUpCompany.dto';
import { signInDto } from './dto/signInDto.dto';
import { AuthCompanyGuards } from './guards/auth.guard';
import { Company } from 'src/companies/decorators/compnaies.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('company-signUp')
  signUpCompany(@Body() signUpDto: signUpCompanyDto) {
    return this.authService.signUpCompany(signUpDto);
  }

  @Post('company-signIn')
  signInCompany(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: signInDto,
  ) {
    return this.authService.signInCompany(signInDto, res);
  }

  @Get('current-company')
  @UseGuards(AuthCompanyGuards)
  getCurrentUser(@Company() companyId) {
    return this.authService.getCurrentUser(companyId);
  }
}
