import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { IntegrationTestManager } from '../../../test/IntegrationTestManager';
import { User } from '../../models/user.model';
import { testUser } from '../stubs/user.stub';

describe('getUser', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('given that the user does already exist', () => {
    let userId: string;

    beforeAll(async () => {
      userId = (
        await integrationTestManager
          .getCollection('users')
          .findOne({ email: testUser.email })
      )._id.toHexString();
    });

    describe('when a getUser query is executed', () => {
      let user: User;

      beforeAll(async () => {
        const response = await request<{ user: User }>(
          integrationTestManager.httpServer,
        )
          .set(
            'Cookie',
            `Authentication=${integrationTestManager.getAccessToken()}`,
          )
          .query(
            gql`
              query GetUser($_id: String!) {
                user(_id: $_id) {
                  email
                }
              }
            `,
          )
          .variables({ _id: userId });
        user = response.data.user;
      });

      test('then the response should be the user', () => {
        expect(user).toEqual({ email: testUser.email });
      });
    });
  });
});
