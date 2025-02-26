import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  companyId: string;

  // @Prop()
  // fileId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
