import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/schema/companies.schema';
import { signUpCompanyDto } from './dto/signUpCompany.dto';
import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signInDto.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    private jwtService: JwtService,
  ) {}

  async signUpCompany({
    email,
    name,
    country,
    industry,
    password,
  }: signUpCompanyDto) {
    const existingCompany = await this.companyModel.findOne({ email });
    console.log(existingCompany, 'existing company');
    if (existingCompany)
      throw new BadRequestException('company with this name already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = {
      email,
      name,
      country,
      industry,
      password: hashedPassword,
    };
    await this.companyModel.create(newCompany);
    return 'company registered successfully';
  }

  async signInCompany({ email, password }: signInDto) {
    const company = await this.companyModel.findOne({ email });
    if (!company)
      throw new BadRequestException('email or passwoer is incorrect');

    const isPassEqual = await bcrypt.compare(password, company.password);
    if (!isPassEqual)
      throw new BadRequestException('email or password is incorrect');

    const payLoad = {
      companyId: company._id,
    };

    const accesstoken = await this.jwtService.sign(payLoad);
    return { accesstoken };
  }

  async getCurrentUser(companyId) {
    console.log(companyId, 'id');
    const user = await this.companyModel
      .findById(companyId)
      .select('-password');
    return user;
  }
}
