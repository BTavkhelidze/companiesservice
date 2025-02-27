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
import { AuthUsersGuards } from './guards/authUser.guard';
import { UserId } from 'src/users/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('company-signUp')
  signUpCompany(@Body() signUpDto: signUpCompanyDto) {
    return this.authService.signUpCompany(signUpDto);
  }

  @Post('company-signIn')
  signInCompany(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: signInDto,
  ) {
    return this.authService.signInCompany(signInDto, res);
  }

  @Post('signIn-user')
  signInUser(
    @Res({ passthrough: true }) res: Response,
    @Body() signInUserDto: signInDto,
  ) {
    return this.authService.signInUser(signInUserDto, res);
  }

  @Post('signUp-users')
  @UseGuards(AuthCompanyGuards)
  signUpUsers(@CompanyId() companyId, @Body() signUpDto: SignUpUsersDto) {
    console.log(companyId, signUpDto, 'sdt');
    return this.authService.signUpUsers(companyId, signUpDto);
  }

  @Get('current-user')
  @UseGuards(AuthUsersGuards)
  getActiveUser(@UserId() userId) {
    return this.authService.getActiveUser(userId);
  }

  @Get('current-company')
  @UseGuards(AuthCompanyGuards)
  getCurrentUser(@CompanyId() companyId) {
    return this.authService.getCurrentUser(companyId);
  }
}
