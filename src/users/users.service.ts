import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { User } from './models/user.model';
import { UserDocument } from './models/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserData: CreateUserInput) {
    await this.validateCreateUserData(createUserData);
    const userDocument = await this.usersRepository.create({
      ...createUserData,
      password: await bcrypt.hash(createUserData.password, 10),
    });
    return this.toModel(userDocument);
  }

  private async validateCreateUserData(createUserData: CreateUserInput) {
    let user: UserDocument;
    try {
      user = await this.usersRepository.findOne({
        email: createUserData.email,
      });
    } catch (err) {}
    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async getUser(getUserArgs: GetUserArgs) {
    const userDocument = await this.usersRepository.findOne(getUserArgs);
    return this.toModel(userDocument);
  }

  async validateUser(email: string, password: string) {
    const userDocument = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(
      password,
      userDocument.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.toModel(userDocument);
  }

  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toHexString(),
      email: userDocument.email,
    };
  }
}
