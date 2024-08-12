import { ClassConstructor, plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model as MongooseModel,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractModel } from '../common/abstract.model';

export abstract class AbstractRepository<
  Model extends AbstractModel<Interface>,
  Interface,
> {
  constructor(
    protected readonly model: MongooseModel<Model>,
    protected readonly cls: ClassConstructor<Model>,
  ) {}

  async create(document: Partial<Interface>): Promise<Model> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return plainToInstance(this.cls, await createdDocument.save());
  }

  async findOne(filterQuery: FilterQuery<Model>): Promise<Model> {
    const document = await this.model.findOne(filterQuery, {}).lean<Model>();

    if (!document) {
      throw new NotFoundException('Model not found.');
    }

    return plainToInstance(this.cls, document);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<Model>,
    update: UpdateQuery<Model>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      throw new NotFoundException('Model not found.');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<Model>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }
}
