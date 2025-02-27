import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Service } from 'src/aws-files/awsFiles.service';
import { AwsSchema } from 'src/aws-files/schema/awsFiles.schema';
import { CompanySchema } from 'src/companies/schema/companies.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'aws', schema: AwsSchema },
      { name: 'company', schema: CompanySchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AwsS3Service],
})
export class UsersModule {}
