import { IsNotEmpty, IsString } from 'class-validator';

export class subscriptionDto {
  @IsNotEmpty()
  @IsString()
  plan: string;

  @IsNotEmpty()
  @IsString()
  stripeCustomerId: string;

  @IsNotEmpty()
  @IsString()
  subscriptionId: string;
}
