import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { User } from './models/user.model';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersRepository extends AbstractRepository<User, IUser> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel, User);
  }
}
