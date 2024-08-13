import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from '../../common/abstract.model';
import { IUser } from '../interfaces/user.interface';
import { IEmailService } from '../../email/email-service.interface';

@Schema()
@ObjectType()
export class User extends AbstractModel<IUser> {
  @Prop({ unique: true })
  @Field()
  private email: string;

  @Prop()
  private password: string;

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  async sendEmail(message: string, emailService: IEmailService) {
    if (this.email.split('@')[1].includes('QA')) {
      await emailService.send(this.email, `QA MESSAGE: ${message}`);
      return;
    }
    await emailService.send(this.email, message);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
