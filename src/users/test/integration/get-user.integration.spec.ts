import gql from 'graphql-tag';
import { Types } from 'mongoose';
import request from 'supertest-graphql';
import { getGqlErrorStatus } from '../../../test/gqlStatus';
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
      )._id.toString();
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
          .mutate(
            gql`
              query GetUser($_id: String!) {
                user(_id: $_id) {
                  email
                }
              }
            `,
          )
          .variables({
            _id: userId,
          });
        user = response.data.user;
      });

      test('then the response should be the user', async () => {
        expect(user).toEqual({ email: testUser.email });
      });
    });
  });

  describe('given that the user does not exist', () => {
    describe('when a getUser query is executed', () => {
      let resStatus: number;

      beforeAll(async () => {
        const { response } = await request<{ user: User }>(
          integrationTestManager.httpServer,
        )
          .set(
            'Cookie',
            `Authentication=${integrationTestManager.getAccessToken()}`,
          )
          .mutate(
            gql`
              query GetUser($_id: String!) {
                user(_id: $_id) {
                  email
                }
              }
            `,
          )
          .variables({
            _id: new Types.ObjectId().toHexString(),
          });
        resStatus = getGqlErrorStatus(response);
      });

      test('then the response should be 404', async () => {
        expect(resStatus).toEqual('404');
      });
    });
  });
});
