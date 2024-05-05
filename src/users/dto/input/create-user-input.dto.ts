import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  readonly email: string;

  @Field()
  @IsStrongPassword()
  readonly password: string;
}
