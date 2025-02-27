import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

import { uploadFileDto } from './dto/uploadFileBody.dto';
import { AwsS3Service } from 'src/aws-files/awsFiles.service';
import { NotFound } from '@aws-sdk/client-s3';
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
