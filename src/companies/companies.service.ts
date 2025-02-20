import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel('company') private companyModel: Model<Company>) {}

  findAll() {
    return this.companyModel.find();
  }

  findOne(id) {
    const company = this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
