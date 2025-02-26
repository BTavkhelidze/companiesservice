import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Company } from 'src/companies/schema/companies.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from 'src/stripe/stripe.service';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'company', schema: Company }]),
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StripeService],
})
export class AuthModule {}
