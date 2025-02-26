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
} from '@nestjs/common';
import { CompaniesService } from './companies.service';

import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthCompanyGuards } from 'src/auth/guards/auth.guard';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { subscriptionDto } from './dto/subscriptionDto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';

@Controller('companies')
@UseGuards(AuthCompanyGuards)
export class CompaniesController {
  private stripe: Stripe;
  constructor(
    private readonly companiesService: CompaniesService,
    private stripeService: StripeService,
    @InjectModel('company') private companyModel: Model<Company>,
  ) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
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
