import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@ObjectType({ isAbstract: true })
@Schema()
export class AbstractModel<T> {
  @Field(() => ID)
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  constructor(args: T) {
    Object.assign(this, args);
    if (!this._id) {
      this._id = new Types.ObjectId();
    }
  }
}
