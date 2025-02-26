import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schema/companies.schema';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'company', schema: CompanySchema }]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, StripeService],
})
export class CompaniesModule {}
