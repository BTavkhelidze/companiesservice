import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';
import { subscriptionDto } from './dto/subscriptionDto.dto';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('users') private userModel: Model<User>,
  ) {}

  findAll() {
    return this.companyModel.find();
  }

  findOne(id) {
    const company = this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return `This action returns a #${id} company`;
  }

  async findAllUsers(companyId) {
    const result = await this.userModel.find({ companyId: companyId });
    console.log(result, 'resssssssssssssss');
    return result;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  async updateSubscription(customerId: string, data: subscriptionDto) {
    const company = await this.companyModel.findById(customerId);
    if (!company) throw new NotFoundException('Company not found');

    company.stripeCustomerId = data.stripeCustomerId;
    company.subscriptionId = data.subscriptionId;
    company.plan = data.plan;
    await company.save();
    return 'Subscription updated';
  }
  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
