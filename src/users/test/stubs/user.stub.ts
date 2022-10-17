import { Types } from 'mongoose';
import { CreateUserInput } from '../../dto/input/create-user-input.dto';
import { User } from '../../models/user.model';

export const userStub: User = {
  _id: new Types.ObjectId().toHexString(),
  email: 'user@example.com',
};

export const testUser: CreateUserInput = {
  email: 'test@example.com',
  password: 'password',
};
