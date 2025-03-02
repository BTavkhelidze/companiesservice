import { Module } from '@nestjs/common';
import { AwsS3Service } from './awsFiles.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AwsSchema } from './schema/awsFiles.schema';
import { UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'aws', schema: AwsSchema },
      { name: 'users', schema: UserSchema },
    ]),
  ],

  providers: [AwsS3Service],
})
export class AwsFilesModule {}
