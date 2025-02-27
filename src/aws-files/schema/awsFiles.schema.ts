import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Aws {
  @Prop()
  fileUrl: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop()
  userId: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'copmany', default: [] })
  companyId: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: [] })
  privateTo: [];
}

export const AwsSchema = SchemaFactory.createForClass(Aws);
