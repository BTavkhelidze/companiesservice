import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';
import { subscriptionDto } from './dto/subscriptionDto.dto';
import { User } from 'src/users/schema/user.schema';
import { AwsS3Service } from 'src/aws-files/awsFiles.service';

@Injectable()
export class CompaniesService {
  constructor(
    private awsS3Service: AwsS3Service,
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

  async uploadFile(filePath, file, id, visibleOnlyFor) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException('Not found');

    const UploadedFile = await this.awsS3Service.uploadFile(
      filePath,
      file,
      id,
      company._id,
      visibleOnlyFor,
    );
    const res = UploadedFile;

    // await this.userModel.findByIdAndUpdate(id, { $push: { filesUrl: res } });
    await this.companyModel.findByIdAndUpdate(id, {
      $push: { filesUrl: res },
    });
    return 'upload successfully';
  }

  async getFile(filePath) {
    return await this.awsS3Service.getFileById(filePath);
  }

  async findAllUsers(companyId) {
    const result = await this.userModel.find({ companyId: companyId });

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
