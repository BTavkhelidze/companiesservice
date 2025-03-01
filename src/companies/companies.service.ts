import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async removeUser(companyId: string, id: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('company not found');

    // await this.companyModel.findByIdAndUpdate(companyId, {$pull: {company.users: id}})
  }

  findOne(id) {
    const company = this.companyModel.findById(id);
    if (!company) throw new NotFoundException();
    return `This action returns a #${id} company`;
  }

  async uploadFile(filePath, file, id, visibleOnlyFor) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException('Not found');
    if (company.filesUrl.length > 10 && company.plan === 'free')
      throw new BadRequestException(
        'You cant add new Files,  Please update subscription plan ',
      );
    if (company.filesUrl.length > 100 && company.plan === 'basic')
      throw new BadRequestException(
        'You cant add new Files,  Please update subscription plan ',
      );
    if (company.filesUrl.length > 1000 && company.plan === 'premium')
      throw new BadRequestException(
        'You cant add new Files,  Please update subscription plan ',
      );
    const UploadedFile = await this.awsS3Service.uploadFile(
      filePath,
      file,
      id,
      company._id,
      visibleOnlyFor,
    );
    const res = UploadedFile;

    await this.companyModel.findByIdAndUpdate(id, {
      $push: { filesUrl: res },
    });
    return 'upload successfully';
  }

  async getFile(id) {
    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException('Not found');
    const filePath = company.filesUrl;

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
