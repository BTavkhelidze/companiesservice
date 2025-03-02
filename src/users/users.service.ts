import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

import { AwsS3Service } from 'src/aws-files/awsFiles.service';

import { Company } from 'src/companies/schema/companies.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private userModel: Model<User>,
    @InjectModel('company') private companyModel: Model<Company>,
    private awsS3Service: AwsS3Service,
  ) {}

  findAll() {
    return `This action returns all users`;
  }

  async uploadFile(filePath, file, id, visibleOnlyFor) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Not found');
    const company = await this.companyModel.findById(user.companyId);
    if (!company) throw new NotFoundException('somthing not found');
    if (company.filesUrl.length > 10 && company.plan === 'free')
      throw new BadRequestException('You cant add new File ');
    if (company.filesUrl.length > 100 && company.plan === 'basic')
      throw new BadRequestException('You cant add new File');
    if (company.filesUrl.length > 1000 && company.plan === 'premium')
      throw new BadRequestException('You cant add new File');
    const UploadedFile = await this.awsS3Service.uploadFile(
      filePath,
      file,
      id,
      user.companyId,
      visibleOnlyFor,
    );
    const res = UploadedFile;

    await this.userModel.findByIdAndUpdate(id, { $push: { filesUrl: res } });
    await this.companyModel.findByIdAndUpdate(user.companyId, {
      $push: { filesUrl: res },
    });
    return 'upload successfully';
  }

  async getFile(filePath) {
    return await this.awsS3Service.getFileById(filePath);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
