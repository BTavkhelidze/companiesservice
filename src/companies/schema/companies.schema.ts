import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Company {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  country: string;

  @Prop()
  industry: string;

  @Prop()
  stripeCustomerId: string;

  @Prop({})
  subscriptionId: string;

  @Prop({ default: 'free' })
  plan: string;

  //   @Prop()
  //   avatar: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
