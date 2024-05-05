import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDocument } from './models/user.schema';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserData') createUserData: CreateUserInput) {
    return this.usersService.createUser(createUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgs) {
    return this.usersService.getUser(getUserArgs);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'me' })
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
