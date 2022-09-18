import request from 'supertest';

export const getGqlErrorStatus = (response: request.Response): number => {
  return response.body.errors[0].extensions.code;
};
