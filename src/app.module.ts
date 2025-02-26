import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { StripeService } from './stripe/stripe.service';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL as string),

    CompaniesModule,
    AuthModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, StripeService],
})
export class AppModule {}
