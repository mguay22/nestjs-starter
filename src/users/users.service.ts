import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { UsersRepository } from './users.repository';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserData: CreateUserInput) {
    await this.usersRepository.create({
      ...createUserData,
      password: await hash(createUserData.password, 10),
    });
  }

  async emailUser(getUserArgs: GetUserArgs, message: string) {
    (await this.getUser(getUserArgs)).sendEmail(message, this.emailService);
  }

  async getUser(getUserArgs: GetUserArgs) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await compare(password, user.getPassword());
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
