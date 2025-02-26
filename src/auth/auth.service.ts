import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/schema/companies.schema';
import { signUpCompanyDto } from './dto/signUpCompany.dto';
import * as bcrypt from 'bcrypt';
import { signInDto } from './dto/signInDto.dto';
import { JwtService } from '@nestjs/jwt';
import { StripeService } from 'src/stripe/stripe.service';
import { SignUpUsersDto } from './dto/signUpUsers.dto';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('company') private companyModel: Model<Company>,
    @InjectModel('users') private userModel: Model<User>,
    private jwtService: JwtService,
    private stripeService: StripeService,
  ) {}

  async signUpCompany({
    email,
    name,
    country,
    industry,
    password,
  }: signUpCompanyDto) {
    const existingCompany = await this.companyModel.findOne({ email });
    const companyNameExists = existingCompany?.name === name;
    if (existingCompany || companyNameExists) {
      throw new BadRequestException(
        'Company with this email or name already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await this.stripeService.createCustomer(email);

    const newCompany = new this.companyModel({
      email,
      name,
      country,
      industry,
      password: hashedPassword,
      stripeCustomerId: customer.id,
      subscriptionId: null,
      plan: 'free',
    });
    await newCompany.save();

    const session = await this.stripeService.createEmbeddedCheckoutSession(
      customer.id,
      'price_1QvwXRLBnqqETekESqovHYqo', // Free plan Price ID
      `${process.env.NEXT_PUBLIC_API_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan_name=free`,
    );

    return {
      message: 'Company registered successfully',
      companyId: newCompany._id,
      clientSecret: session.clientSecret,
    };
  }

  async signInCompany({ email, password }: signInDto, res) {
    const company = await this.companyModel.findOne({ email });
    if (!company)
      throw new BadRequestException('email or passwoer is incorrect');

    const isPassEqual = await bcrypt.compare(password, company.password);
    if (!isPassEqual)
      throw new BadRequestException('email or password is incorrect ');

    const payLoad = {
      companyId: company._id,
    };

    const accessToken = await this.jwtService.sign(payLoad);

    res.cookie('accesstoken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 2 * 1000,
      sameSite: 'lax',
      path: '/',
    });
    return res.json({ message: 'Login successful' });
  }

  async signUpUsers(companyId: string, signUpDto: SignUpUsersDto) {
    const { fullName, email, password } = signUpDto;
    const user = await this.userModel.findOne({ email });
    if (user) throw new BadRequestException('user already exists');

    const company = await this.companyModel.findById(companyId);
    if (!company) throw new BadRequestException('company not found');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      email,
      companyId,
      password: hashedPassword,
    };
    const resUser = await this.userModel.create(newUser);

    await this.companyModel.findByIdAndUpdate(companyId, {
      $push: { users: resUser },
    });
    return 'user created successfully';
  }

  async getCurrentUser(companyId) {
    console.log(companyId, 'id');
    const user = await this.companyModel
      .findById(companyId)
      .select('-password');
    return user;
  }
}
