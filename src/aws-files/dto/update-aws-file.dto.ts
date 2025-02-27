import { PartialType } from '@nestjs/mapped-types';
import { CreateAwsFileDto } from './create-aws-file.dto';

export class UpdateAwsFileDto extends PartialType(CreateAwsFileDto) {}
