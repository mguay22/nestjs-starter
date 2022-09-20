import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { Connection } from 'mongoose';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { testUser } from '../users/test/stubs/user.stub';

export class IntegrationTestManager {
  public httpServer: any;

  private app: INestApplication;
  private accessToken: string;
  private connection: Connection;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();
    this.app.use(cookieParser());
    await this.app.init();
    this.httpServer = this.app.getHttpServer();

    const authService = this.app.get<AuthService>(AuthService);
    this.connection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    const userId = await this.connection
      .collection('users')
      .findOne({ email: testUser.email });
    this.accessToken = await authService.login({
      ...testUser,
      _id: userId._id.toHexString(),
    });
  }

  async afterAll() {
    this.app.close();
  }

  getCollection(collectionName: string) {
    return this.connection.collection(collectionName);
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
