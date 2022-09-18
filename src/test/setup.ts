import { Test } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { testUser } from '../users/test/stubs/user.stub';
import { UsersService } from '../users/users.service';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const usersService = moduleRef.get<UsersService>(UsersService);
  await usersService.createUser(testUser);

  await app.close();
};
