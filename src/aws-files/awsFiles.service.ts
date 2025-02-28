import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/mongoose';
import { Aws } from './schema/awsFiles.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class AwsS3Service {
  private bucketName;
  private s3;

  constructor(
    @InjectModel('aws') private awsModel: Model<Aws>,
    @InjectModel('users') private userModel: Model<User>,
  ) {
    this.bucketName = process.env.AWS_BUCKET_NAME;

    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(filePath: string, file, userId, companyId, visibleOnlyFor) {
    const user = await this.userModel.findById(userId);

    if (!file || !filePath)
      throw new BadRequestException('filePath and file are required');
    const config = {
      Key: filePath,
      Bucket: this.bucketName,
      Body: file,
    };

    const awsFile = {
      fileUrl: filePath,
      isPrivate: false,
      userId: user ? userId : '',
      companyId: companyId.toString(),
      privateTo: visibleOnlyFor.length === 0 ? visibleOnlyFor : [],
    };
    const resultoOfUpdate = await this.awsModel.create(awsFile);

    if (!resultoOfUpdate) throw new BadRequestException('something went wrong');
    const uploadCommand = new PutObjectCommand(config);
    await this.s3.send(uploadCommand);

    return filePath;
  }

  async getFileById(filePath) {
    // console.log(filePath, '3');
    if (!filePath) throw new BadRequestException('fileId is required');

    const result: string[] | null = [];

    for (const file of filePath) {
      console.log(file, '4');
      const config = {
        Key: file,
        Bucket: this.bucketName,
      };

      const getCommand = new GetObjectCommand(config);
      const fileStream = await this.s3.send(getCommand);
      if (fileStream.Body instanceof Readable) {
        const chunck: Uint8Array[] = [];
        for await (const chunk of fileStream.Body) {
          chunck.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunck);

        const base64 = fileBuffer.toString('base64');
        const file = `data:${fileStream.ContentType};base64,${base64}`;

        result.push(file);
      }
    }
    return result;
  }

  async getAllFileUrl() {
    const files = await this.awsModel.find().exec();
    return files;
  }
}
