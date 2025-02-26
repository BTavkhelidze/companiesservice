import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CompanySchema } from 'src/companies/schema/companies.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'company', schema: CompanySchema }]),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
