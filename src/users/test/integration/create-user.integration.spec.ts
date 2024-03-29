import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { getGqlErrorStatus } from '../../../test/gqlStatus';
import { IntegrationTestManager } from '../../../test/IntegrationTestManager';
import { User } from '../../models/user.model';
import { testUser, userStub } from '../stubs/user.stub';

describe('createUser', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('given that the user does not already exist', () => {
    describe('when a createUser mutation is executed', () => {
      let createdUser: User;

      beforeAll(async () => {
        const response = await request<{ createUser: User }>(
          integrationTestManager.httpServer,
        )
          .mutate(
            gql`
              mutation CreateUser($createUserData: CreateUserInput!) {
                createUser(createUserData: $createUserData) {
                  email
                }
              }
            `,
          )
          .variables({
            createUserData: {
              email: userStub.email,
              password: 'example',
            },
          })
          .expectNoErrors();
        createdUser = response.data.createUser;
      });

      test('then the response should be the newly created user', () => {
        expect(createdUser).toMatchObject({
          email: userStub.email,
        });
      });

      test('then the new user should be created', async () => {
        const user = await integrationTestManager
          .getCollection('users')
          .findOne({ email: userStub.email });
        expect(user).toBeDefined();
      });
    });
  });

  describe('given that the user does already exist', () => {
    describe('when a createUser mutation is executed', () => {
      let resStatus: number;

      beforeAll(async () => {
        const { response } = await request<{ createUser: User }>(
          integrationTestManager.httpServer,
        )
          .mutate(
            gql`
              mutation CreateUser($createUserData: CreateUserInput!) {
                createUser(createUserData: $createUserData) {
                  email
                }
              }
            `,
          )
          .variables({
            createUserData: testUser,
          });
        resStatus = getGqlErrorStatus(response);
      });

      test('then the response should be a 422', () => {
        expect(resStatus).toBe('422');
      });
    });
  });
});
