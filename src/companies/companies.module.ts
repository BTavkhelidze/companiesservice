import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schema/companies.schema';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from 'src/stripe/stripe.service';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'company', schema: CompanySchema },
      { name: 'users', schema: UserSchema },
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, StripeService],
})
export class CompaniesModule {}
