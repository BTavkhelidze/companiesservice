import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schema/companies.schema';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from 'src/stripe/stripe.service';
import { UserSchema } from 'src/users/schema/user.schema';
import { AwsS3Service } from 'src/aws-files/awsFiles.service';
import { AwsSchema } from 'src/aws-files/schema/awsFiles.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'company', schema: CompanySchema },
      { name: 'users', schema: UserSchema },
      { name: 'aws', schema: AwsSchema },
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, StripeService, AwsS3Service],
})
export class CompaniesModule {}
