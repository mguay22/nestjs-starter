import { Types } from 'mongoose';
import { CreateUserInput } from '../../dto/input/create-user-input.dto';
import { IUser } from '../../interfaces/user.interface';

export const userStub: IUser = {
  email: 'user@example.com',
  password: 'TestPassword',
};

export const testUser: CreateUserInput = {
  email: 'test@example.com',
  password: 'password',
};
