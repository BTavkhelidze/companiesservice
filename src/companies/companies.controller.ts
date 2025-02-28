import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Req,
  BadRequestException,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthCompanyGuards } from 'src/auth/guards/auth.guard';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { subscriptionDto } from './dto/subscriptionDto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';
import { CompanyId } from './decorators/compnaies.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileDto } from 'src/users/dto/uploadFileBody.dto';
import { AwsS3Service } from 'src/aws-files/awsFiles.service';

@Controller('companies')
@UseGuards(AuthCompanyGuards)
export class CompaniesController {
  private stripe: Stripe;
  constructor(
    private readonly companiesService: CompaniesService,
    private stripeService: StripeService,
    private awsService: AwsS3Service,
    @InjectModel('company') private companyModel: Model<Company>,
  ) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('allUsers')
  async findAllUsers(@CompanyId() companyId) {
    return this.companiesService.findAllUsers(companyId);
  }

  @Get('/read-allFile')
  getAllFileUrl() {
    return this.awsService.getAllFileUrl();
  }

  @Post('/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CompanyId() id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() visibleOnlyFor: uploadFileDto,
  ) {
    const path = uuidv4().toString();

    const filePath = `files/${file.originalname ? file.originalname : path}`;

    return this.companiesService.uploadFile(
      filePath,
      file.buffer,
      id,
      visibleOnlyFor,
    );
  }

  @Get('/getFile')
  getFile(@CompanyId() id: string) {
    return this.companiesService.getFile(id);
  }

  @Delete('/delete-user')
  removeUser(@CompanyId() companyId: string, @Body('id') id: string) {
    return this.companiesService.removeUser(companyId, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Post('/updatePlan')
  async updateSubscription(@Body() data: subscriptionDto, @Req() request) {
    const id = request.companyId;

    const company = await this.companyModel.findById(id);
    if (!company) throw new NotFoundException('Company not found');

    return this.companiesService.updateSubscription(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
