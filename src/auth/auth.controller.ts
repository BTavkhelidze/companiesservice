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
import { CompanyId } from 'src/companies/decorators/compnaies.decorator';
import { Response } from 'express';
import { SignUpUsersDto } from './dto/signUpUsers.dto';

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

  @Post('signUp-users')
  @UseGuards(AuthCompanyGuards)
  signUpUsers(@CompanyId() companyId, @Body() signUpDto: SignUpUsersDto) {
    console.log(companyId, signUpDto, 'sdt');
    return this.authService.signUpUsers(companyId, signUpDto);
  }

  @Get('current-company')
  @UseGuards(AuthCompanyGuards)
  getCurrentUser(@CompanyId() companyId) {
    return this.authService.getCurrentUser(companyId);
  }
}
